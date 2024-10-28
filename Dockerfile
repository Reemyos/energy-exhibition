FROM python:3.11-slim
LABEL authors="reem"

WORKDIR /app

COPY data_forwarding/requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Install socat
RUN apt-get update && apt-get install -y socat

# Install necessary packages, including mosquitto-clients for testing
RUN apt-get update && apt-get install -y mosquitto-clients && rm -rf /var/lib/apt/lists/*

COPY data_forwarding .

COPY mqtt_utils.py .

CMD ["python", "serial_data_forwarder.py"]