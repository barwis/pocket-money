#!/usr/bin/env python3

import flask
from arlo import Arlo
import pprint
import json
from flask import request

USERNAME = "lordzix@gmail.com"
PASSWORD = "VenCeym3"

app = flask.Flask(__name__)
app.config["DEBUG"] = True

arlo = Arlo(USERNAME, PASSWORD)


#  returns tuple (response json, code)
def getDevice(deviceName):
    device = None
    if deviceName is None:
        return {"status": "no deviceName provided"}, 400
    try:
        device = arlo.GetDevice(deviceName)
    except:
        return {"status": "could not locate device"}, 400

    return device, 200


@app.route("/devices", methods=["GET"])
def cameras():
    devices = arlo.GetDevices()
    devicesList = []
    devicesDict = {}
    for device in devices:
        deviceId = device["deviceId"]
        deviceDict = {
            "deviceType": device["deviceType"],
            "deviceName": device["deviceName"],
            "deviceId": device["deviceId"],
            "thumbnail": device["presignedLastImageUrl"],
            "device": device,
        }

        devicesList.append(deviceDict)
        devicesDict[deviceId] = deviceDict

    return json.dumps(devicesList)


# '/login$username=<username>$password=<password>',
@app.route("/startStream", methods=["GET"])
def startStream():
    deviceName = request.args.get("deviceName")

    device, status = getDevice(deviceName)

    if status == 400:
        return device, status
    print("got device. starting stream...")
    url = arlo.StartStream(device, device)
    #  if stream is already started, parameter &watchalong=true will be added to stream url
    print(url)

    return url, 200


@app.route("/stopStream", methods=["GET"])
def stopStream():
    deviceName = request.args.get("deviceName")

    device, status = getDevice(deviceName)

    if status == 400:
        return device, status

    arlo.StopStream(device, device)

    return {"status": "stream stopped"}, 200


def main():
    app.run(host="0.0.0.0", port=5001)


if __name__ == "__main__":
    main()
