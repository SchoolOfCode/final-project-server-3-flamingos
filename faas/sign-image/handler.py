from cloudinary import utils
from json import dumps
from os import getenv
from time import time


def handle(req):
    timestamp = int(time())
    signature = utils.api_sign_request(
        {"timestamp": timestamp}, getenv("CLOUD_SECRET"))

    result = {
        "signature": signature,
        "timestamp": timestamp
    }

    return dumps(result)
