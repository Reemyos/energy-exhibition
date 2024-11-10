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
async def websocket_handler(websocket, path, serial_connection):
    try:
        while True:
            # Read a line from the serial port
            data = serial_connection.readline().decode('utf-8').strip()
            if data:
                await websocket.send(data)
                logger.info(f"Sent: {data}")
    except serial.serialutil.SerialException:
        logger.error("Serial connection shut down")
    except websockets.ConnectionClosed:
        logger.info("Client disconnected")


async def main():
    # Try to find an Arduino; otherwise, use a virtual port
    serial_connection = find_arduino_port()
    if not serial_connection:
        logger.info("No Arduino found. Starting Virtual Serial Port...")
        # Add logging around these functions to confirm their status
        logger.info("Attempting to create virtual serial ports.")
        port1, port2, socat_process = create_virtual_serial_ports()
        logger.info("Virtual serial ports created successfully.")
        multiprocessing.Process(target=send_data, args=(port1, 9600)).start()
        serial_connection = serial.Serial(port2, 9600)  # Connect to the virtual port

    # Start the WebSocket server
    logger.info("Starting WebSocket server on ws://0.0.0.0:9001")
    async with websockets.serve(lambda ws, path: websocket_handler(ws, path, serial_connection), '0.0.0.0', 9001):
        await asyncio.Future()  # Keep server running indefinitely

# Run the main function
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except asyncio.exceptions.CancelledError:
        logger.error("Server stopped.")
    except KeyboardInterrupt:
        logger.error("Server stopped.")
