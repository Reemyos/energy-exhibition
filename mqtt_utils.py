import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def on_connect(client, userdata, connect_flags, reason_code, properties):
    logger.info(userdata)
    if reason_code == 0:
        logger.info("Connected to MQTT Broker!")
    else:
        logger.error(f"Failed to connect, return code {reason_code}\n")


def on_subscribe(client, userdata, mid, reason_code_list, properties):
    # Since we subscribed only for a single channel, reason_code_list contains
    # a single entry
    if reason_code_list[0].is_failure:
        logger.info(f"Broker rejected you subscription: {reason_code_list[0]}")
    else:
        logger.info(f"Broker granted the following QoS: {reason_code_list[0].value}")


def on_publish(client, userdata, mid, reason_code, properties):
    logger.info(f"Message published with mid: {mid}")
