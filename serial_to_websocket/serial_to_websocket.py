import asyncio
import logging
import multiprocessing
import time

import serial
import serial.tools.list_ports
import websockets

from virtual_serial_port import create_virtual_serial_ports, send_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Helper function to find an Arduino on an open serial port
def find_arduino_port(baud_rate=9600):
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if ("Arduino" in port.description or "ttyACM" in port.device or "ttyUSB" in port.device or
                'usbserial' in port.device):
            try:
                ser = serial.Serial(port.device, baud_rate)
                logger.info(f"Connected to {port.device}")
                time.sleep(2)  # Wait for the connection to be established properly
                return ser
            except Exception as e:
                logger.error(f"Could not open {port.device}: {e}")
    return None


# WebSocket handler that sends serial data to connected clients
async def websocket_handler(websocket, serial_connection):
    try:
        while True:
            # Read a line from the serial port
            data = serial_connection.readline().decode('utf-8').strip()
            if data:
                await websocket.send(data)
                logger.info(f"Sent: {data}")
    except serial.serialutil.SerialException:
        logger.error("Serial connection shut down.")
        serial_connection.close()
    except websockets.ConnectionClosed:
        logger.info("Client disconnected.")


async def start_websocket_server(serial_connection):
    # Start the WebSocket server
    logger.info("Starting WebSocket server on ws://0.0.0.0:9001")
    async with websockets.serve(lambda ws: websocket_handler(ws, serial_connection), '0.0.0.0', 9001):
        await asyncio.Future()  # Keep server running indefinitely


async def virtual_port():
    logger.info("No Arduino found. Starting Virtual Serial Port...")
    # Add logging around these functions to confirm their status
    logger.info("Attempting to create virtual serial ports.")
    port1, port2, socat_process = create_virtual_serial_ports()
    logger.info("Virtual serial ports created successfully.")
    multiprocessing.Process(target=send_data, args=(port1, 9600)).start()
    return serial.Serial(port2, 9600)  # Connect to the virtual port


async def main(use_virtual_port=False):
    serial_connection = find_arduino_port()

    # Check if an Arduino is found; if not, use a virtual port if requested
    if not serial_connection and use_virtual_port:
        serial_connection = await virtual_port()

    # Start WebSocket server in a background task
    websocket_task = asyncio.create_task(start_websocket_server(serial_connection))

    try:
        # Loop to detect disconnection and attempt reconnection
        while True:
            if not serial_connection or not serial_connection.is_open:
                logger.info("Serial device disconnected. Retrying in 5 seconds...")
                await asyncio.sleep(5)
                serial_connection = find_arduino_port()

                if not serial_connection and use_virtual_port:
                    serial_connection = await virtual_port()

                # Restart the WebSocket server if reconnected
                if serial_connection and serial_connection.is_open:
                    websocket_task.cancel()  # Cancel the existing WebSocket task
                    websocket_task = asyncio.create_task(start_websocket_server(serial_connection))
            await asyncio.sleep(1)  # Avoid busy-waiting

    except asyncio.CancelledError:
        logger.info("Server stopped.")
    except KeyboardInterrupt:
        logger.info("Server interrupted.")


# Run the main function
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.error("Server stopped.")
