# ESP8266 IoT Framework ![Status](https://travis-ci.com/maakbaas/esp8266-iot-framework.svg?branch=master)

The ESP8266 IoT Framework is a set of modules to be used as a starting point in new ESP8266 projects, implementing HTTPS requests, a React web interface, WiFi manager, configuration manager and OTA updates.

The unique advantage of this framework is that code generation at build time is used to provide different benefits. Code generation is used to dynamically generate a configuration struct from a JSON file, to incorporate the web interface into PROGMEM in the firmware and to bundle a full root certificate store in PROGMEM that allows the ESP8266 to do secure HTTPS requests to arbitrary URLs.

## Documentation

* [Introduction](https://github.com/maakbaas/esp8266-iot-framework#introduction)
* [Getting Started](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/getting-started.md)
* [Installation Guide](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/installation-guide.md)
* [Web Server](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/web-server.md)
* [WiFi Manager](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/wifi-manager.md)
* [Configuration Manager](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md)
* [File Manager](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/file-manager.md)
* [HTTPS Requests](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/fetch.md)
* [OTA Updater](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/updater.md)

Details beyond the documentation can be found at [maakbaas.com](https://maakbaas.com/esp8266-iot-framework/).

## Quick start

If you are new to PlatformIO, start with the [installation guide](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/installation-guide.md). Otherwise, simply start a new project for your ESP8266, and add the following line to your `platformio.ini` file:

```ini
lib_deps = ESP8266 IoT Framework
```

Take one the [examples](https://github.com/maakbaas/esp8266-iot-framework/tree/master/examples) as a starting point to develop your application.

## Screenshots

<p align="center"><img width="49%" src="https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-wifi.png" /> &nbsp;<img width="49%" src="https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-config.png" />&nbsp;</p>
<p align="center"><img width="49%" src="https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-file.png" /> &nbsp;<img width="49%" src="https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-firmware.png" />&nbsp;</p>

## Introduction

The framework consists of five main parts. A web server including the interface it's serving, a WiFi manager, a configuration manager and classes for HTTP requests and OTA updates. The architecture of the framework is shown in the following diagram:

![Architecture](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/img/framework.png?raw=true)
*Architecture of the framework shown in blue*

The basic principles used in developing this framework are:

1. The framework is built upon the ESP8266 Arduino libraries
2. The framework does not include any functionality to control external hardware.
3. The framework is fully self-contained for easy deployment. SPIFFS/LittleFS storage is not needed.
4. There is a strict split between the ESP8266 application and the web interface through an API.

In short, the framework aims to be unobtrusive, easy to deploy, with a modern web interface that's easy to modify and expand for different projects :). 

**Note:** The ESP32 is not supported by this framework right now, due to the reliance on BearSSL. BearSSL is part of the ESP8266 Arduino libraries, but not part of the ESP32 Arduino libraries.
