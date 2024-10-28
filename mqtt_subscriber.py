import logging
import time

from paho.mqtt import client as mqtt

from mqtt_utils import on_connect, on_subscribe

logger = logging.getLogger(__name__)


class MQTTSubscriber:
    def __init__(self, broker='localhost', port=1883, topic='sensor/data'):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.client.enable_logger()
        self.client.on_connect = on_connect
        self.client.on_message = self.on_message
        self.client.on_subscribe = on_subscribe
        self.client.connect(broker, port)
        time.sleep(2)
        self.topic = topic
        self.messages_received = 0

    def on_message(self, client, userdata, message):
        logger.info(f"Received message '{message.payload.decode()}' on topic '{message.topic}'")
        self.messages_received += 1

    def start(self):
        self.client.subscribe(self.topic, qos=2)
        self.client.loop_start()

    def stop(self):
        self.client.loop_stop()

    def __del__(self):
        self.client.disconnect()


if __name__ == '__main__':
    try:
        subscriber = MQTTSubscriber()
        subscriber.start()
        while True:
            pass
    except KeyboardInterrupt:
        del subscriber
        logger.info("Exiting...")
