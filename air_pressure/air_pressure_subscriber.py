import logging
from collections import deque

from mqtt_subscriber import MQTTSubscriber


logger = logging.getLogger(__name__)


class AirPressureSubscriber(MQTTSubscriber):
    def __init__(self, data_buffer: deque, broker='localhost', port=1883, topic='sensor/data'):
        super().__init__(broker, port, topic)
        self._data_buffer = data_buffer

    @property
    def data_buffer(self):
        return self._data_buffer

    def on_message(self, client, userdata, message):
        air_pressure = message.payload.decode()
        self._data_buffer.append(int(air_pressure))
        logger.info(f"Air pressure: {air_pressure} hPa")
