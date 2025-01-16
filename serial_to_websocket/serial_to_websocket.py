import asyncio
import logging
import random
import time

import serial
import serial.tools.list_ports
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class LogMessage(BaseModel):
    message: str


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filename="../usage.log",
    filemode="a",
)
logger = logging.getLogger(__name__)


MESSAGE_DELAY = 0.4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the specific origin if needed
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Helper function to find an Arduino on an open serial port
def find_arduino_port(baud_rate=9600):
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if (
            "Arduino" in port.description
            or "ttyACM" in port.device
            or "ttyUSB" in port.device
            or "usbserial" in port.device
        ):
            try:
                ser = serial.Serial(port.device, baud_rate)
                logger.info(f"Connected to {port.device}")
                time.sleep(2)  # Wait for the connection to be established properly
                return ser
            except Exception as e:
                logger.error(f"Could not open {port.device}: {e}")
    return None


# WebSocket handler for Arduino
async def arduino_websocket_handler(websocket: WebSocket, serial_connection):
    try:
        while True:
            data = serial_connection.readline().decode("utf-8").strip()
            if data:
                await websocket.send_text(data)
    except serial.SerialException:
        logger.error("Serial connection shut down.")
        serial_connection.close()
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected.")


# WebSocket handler for virtual data
async def virtual_websocket_handler(websocket: WebSocket, *args):
    value = 0  # Start at 0
    try:
        while True:
            if value >= 10:
                if random.random() < 0.3:  # 30% chance to reset to 0
                    value = 0
                else:
                    value = 10  # Hold 10 for some cycles without reset
            else:
                value += random.choice([0, 1])  # Increment by 0 or 1

            message = f"{value}"
            await websocket.send_text(message)
            await asyncio.sleep(MESSAGE_DELAY)
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected.")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, use_virtual_port: bool = True):
    await websocket.accept()
    logger.info("WebSocket client connected.")
    serial_connection = None
    if not use_virtual_port:
        serial_connection = find_arduino_port()
        if not serial_connection:
            await websocket.close(code=1011)
            logger.error("No Arduino device found.")
            return
    handler = (
        arduino_websocket_handler if not use_virtual_port else virtual_websocket_handler
    )
    await handler(websocket, serial_connection)


@app.get("/")
def root():
    return {"message": "FastAPI WebSocket Server Running"}


@app.post("/log")
async def log_message(log: LogMessage):
    logger.info(log.message)
    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "serial_to_websocket:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )
