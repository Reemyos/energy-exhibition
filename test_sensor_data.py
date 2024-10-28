import time

import pytest

from mqtt_subscriber import MQTTSubscriber
from data_forwarding.serial_data_forwarder import SerialDataForwarder


@pytest.fixture
def data_forwarder():
    return SerialDataForwarder()


def test_sensor_data(data_forwarder):
    subscriber = MQTTSubscriber()
    subscriber.start()
    data_forwarder.start()
    time.sleep(10)


