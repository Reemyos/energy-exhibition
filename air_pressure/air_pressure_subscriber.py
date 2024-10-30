import logging
from collections import deque

from mqtt_subscriber import MQTTSubscriber


logger = logging.getLogger(__name__)


class AirPressureSubscriber(MQTTSubscriber):
    def __init__(self, data_buffer: deque, label=None, echart=None, high_chart=None,
                 broker='localhost', port=1883, topic='sensor/data'):
        super().__init__(broker, port, topic)
        self._data_buffer = data_buffer
        self.label = label
        self.echart = echart
        self.high_chart = high_chart
        self.current_value = 0

    @property
    def data_buffer(self):
        return self._data_buffer

    def on_message(self, client, userdata, message):
        air_pressure = message.payload.decode()
        self._data_buffer.append(int(air_pressure))
        self.current_value = int(air_pressure)
        if self.echart:
            self.echart.options['series'][0]['data'] = [[i - 0.5, value] for i, value in enumerate(self._data_buffer, 1)]
            self.echart.view.update()
        if self.high_chart:
            self.high_chart.options['series'][0]['data'] = [self.current_value]
            self.high_chart.view.update()
        logger.info(f"Air pressure: {air_pressure} hPa")
