import logging
import time
import random

import serial
import subprocess
import re

MESSAGE_DELAY = 0.4


logger = logging.getLogger(__name__)


def create_virtual_serial_ports():
    # Run socat command to create virtual serial ports
    socat_process = subprocess.Popen(
        ["socat", "-d", "-d", "pty,raw,echo=0", "pty,raw,echo=0"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )

    # Read output to capture port names
    port1, port2 = None, None
    for line in socat_process.stderr:
        decoded_line = line.decode("utf-8")
        logger.info(decoded_line.strip())  # Print socat output for visibility

        # Use regex to capture the PTY device paths
        match = re.search(r'PTY is (/dev/ttys[0-9]+)', decoded_line)
        if match:
            if not port1:
                port1 = match.group(1)
            else:
                port2 = match.group(1)
                break  # Exit once both ports are captured

    if port1 and port2:
        logger.info(f"Virtual serial ports created: {port1}, {port2}")
    else:
        raise RuntimeError("Failed to create virtual serial ports with socat.")

    return port1, port2, socat_process


def send_data(port1, baud_rate):
    try:

        # Use port1 to send data
        sending_port = port1
        ser = serial.Serial(sending_port, baudrate=baud_rate, timeout=1)
        logger.info(f"Successfully connected to {sending_port}")

        value = 0  # Start at 0
        while True:
            # If value is at max, reset to 0 randomly to avoid predictable patterns
            if value >= 10:
                if random.random() < 0.3:  # 30% chance to reset to 0
                    value = 0
                else:
                    value = 10  # Hold 10 for some cycles without reset
            else:
                # Increment value by 0 or 1 to keep it non-decreasing
                value += random.choice([0, 1])

            message = f"{value}\n"
            ser.write(message.encode('utf-8'))
            logger.info(f"Sent: {message.strip()}")
            time.sleep(MESSAGE_DELAY)

    except serial.SerialException as e:
        logger.error(f"Error with serial connection: {e}")
    except KeyboardInterrupt:
        logger.error("\nInterrupted by user. Closing connections.")


if __name__ == "__main__":
    port1, port2, socat_process = create_virtual_serial_ports()
    send_data(port1, baud_rate=115200)
    socat_process.terminate()
