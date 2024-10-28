import logging
import time
from abc import abstractmethod

import paho.mqtt.client as mqtt

from mqtt_utils import on_connect, on_publish

logger = logging.getLogger(__name__)


class DataForwarder:
    def __init__(self, mqtt_broker='localhost', mqtt_port=1883, mqtt_topic='sensor/data'):
        # MQTT setup
        self._mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self._mqtt_client.enable_logger()
        self._mqtt_topic = mqtt_topic
        self._mqtt_client.on_connect = on_connect
        self._mqtt_client.on_publish = on_publish

        # Connect to the MQTT broker
        self._mqtt_client.connect(mqtt_broker, mqtt_port)

        # Sleep for 2 seconds to allow the connection to establish
        time.sleep(2)

    def start(self):
        # Start background thread to handle incoming data
        self._mqtt_client.loop_start()
        self.forward_data()

    @abstractmethod
    def forward_data(self):
        raise NotImplementedError("forward_data method must be implemented by the subclass")

    def __del__(self):
        try:
            # Disconnect MQTT client
            self._mqtt_client.loop_stop()
            self._mqtt_client.disconnect()
        except AttributeError:
            logger.error("Couldn't connect to MQTT broker")
