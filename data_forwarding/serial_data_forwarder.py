import logging
import serial

from data_forwarder import DataForwarder

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SerialDataForwarder(DataForwarder):
    def __init__(self, serial_port='/dev/ttys006', baud_rate=9600, mqtt_broker='localhost',
                 mqtt_port=1883, mqtt_topic='sensor/data'):
        super().__init__(mqtt_broker, mqtt_port, mqtt_topic)
        try:
            self._serial_port = serial.Serial(serial_port, baud_rate, timeout=1)
        except serial.serialutil.SerialException:
            logger.error(f"Serial port {serial_port} not found.")
            exit(1)

    def start(self):
        logger.info("Starting data forwarding...")
        self._serial_port.flush()
        super().start()

    def forward_data(self):
        while True:
            if self._serial_port.in_waiting > 0:
                data = self._serial_port.readline()
                self._mqtt_client.publish(self._mqtt_topic, data, qos=2)

    def __del__(self):
        try:
            if self._serial_port.is_open:
                self._serial_port.close()
            logger.info("Serial connection closed.")
        except AttributeError:
            raise serial.serialutil.SerialException("Couldn't connect to serial port")
        super().__del__()


if __name__ == '__main__':
    try:
        forwarder = SerialDataForwarder()
        forwarder.start()
    except KeyboardInterrupt:
        del forwarder
        logger.info("Exiting...")




