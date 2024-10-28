import time
import random

import serial
import subprocess
import re


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
        print(decoded_line.strip())  # Print socat output for visibility

        # Use regex to capture the PTY device paths
        match = re.search(r'PTY is (/dev/ttys[0-9]+)', decoded_line)
        if match:
            if not port1:
                port1 = match.group(1)
            else:
                port2 = match.group(1)
                break  # Exit once both ports are captured

    if port1 and port2:
        print(f"Virtual serial ports created: {port1}, {port2}")
    else:
        raise RuntimeError("Failed to create virtual serial ports with socat.")

    return port1, port2, socat_process


def send_data(port1, baud_rate):
    try:

        # Use port1 to send data
        sending_port = port1
        ser = serial.Serial(sending_port, baudrate=baud_rate, timeout=1)
        print(f"Successfully connected to {sending_port}")

        # Send data every second
        while True:
            message = f"{random.randint(0, 10)}\n"
            ser.write(message.encode('utf-8'))
            print(f"Sent: {message.strip()}")
            time.sleep(1)

    except serial.SerialException as e:
        print(f"Error with serial connection: {e}")
    except KeyboardInterrupt:
        print("\nInterrupted by user. Closing connections.")


if __name__ == "__main__":
    port1, port2, socat_process = create_virtual_serial_ports()
    send_data(port1, baud_rate=115200)
    socat_process.terminate()
