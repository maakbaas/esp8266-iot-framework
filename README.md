# ESP8266 IoT Framework

The ESP8266 IoT Framework is a set of modules to be used as a starting point in new ESP8266 projects, implementing HTTPS requests, a React web interface and a configuration manager.

## Documentation

* [Setup](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/setup.md)
* [Web Server](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/web-server.md)
* [WiFi Manager](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/wifi-manager.md)
* [Configuration Manager](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md)
* [HTTPS Requests](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/fetch.md)
* [OTA Updater](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/updater.md)

## Introduction

The framework consists of five main parts. A web server including the interface it's serving, a WiFi manager, a configuration manager and classes for HTTP requests and OTA updates. The architecture of the framework is shown in the following diagram:

![Architecture](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/img/framework.png?raw=true)
*Architecture of the framework shown in blue*

The basic principles used in developing this framework are:

1. The framework is built upon the ESP8266 Arduino libraries
2. The framework does not include any functionality to control external hardware.
3. The framework is fully self-contained for easy deployment. SPIFFS storage is not needed for the framework.
4. There is a strict split between the ESP8266 application and the web interface through an API.

In short, the framework aims to be unobtrusive, easy to deploy, and the web interface should be easy to modify and expand for different projects :). 
