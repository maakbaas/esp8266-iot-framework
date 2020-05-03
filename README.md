# ESP8266 IoT Framework

The ESP8266 IoT Framework is a set of modules to be used as a starting point in new ESP8266 projects, implementing HTTPS requests, a React web interface and a configuration manager.

1. The framework is built upon the ESP8266 Arduino libraries
2. The framework will not include any functionality to control external hardware.
3. The framework is fully self-contained for easy deployment. SPIFFS storage is not needed for the framework.
4. There is a strict split between the ESP8266 application and the web interface through an API.

In short, the framework aims to be unobtrusive, easy to deploy, and the web interface should be easy to modify and expand for different projects. The framework consists of five main parts. A web server including the interface it's serving, a WiFi manager, a configuration manager and classes for HTTP requests and OTA updates. The architecture of the framework is shown in the following diagram:

![Architecture](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/img/framework.png?raw=true)
*Architecture of the framework shown in blue*

### Web Server
The web server is based on ESPAsyncWebServer and presents the web interface which is needed to configure WiFi and other settings from the browser. This web interface is developed in React (currently ~40Kb gzipped), and communicates with the ESP8266 through an API. To be able to get and set information from this API, the web server class will interact with the other framework modules. The GUI content is merged into a single gzipped file, which is then converted into a byte array and stored in the ESP8266 PROGMEM.

### WiFi Manager
The function of the WiFi manager is to help the user connect to a WiFi network. If no known network is found the ESP8266 will start a hotspot with a captive portal in which the network settings can be changed. WiFi information will be preserved in memory so that the ESP8266 will connect automatically in the future.

### Configuration Manager
For whatever function a device with an ESP8266 might have, it could be that you want the user to change some settings or parameters, such as the speed of a motor, or the color of a LED. The configuration manager provides a method to modify parameters from the broswer which will be accessible from the software application. The parameters are generated from a JSON file. The configuration manager stores a struct with configuration data in the EEPROM. Structure can be changed at build time, data can be changed at runtime through the GUI which is also auto generated from the JSON.

### HTTPS Requests
Fetching or posting data to the internet is one of the core tasks of an IoT device. Doing so over HTTP is implemented quite well in the default ESP8266 Arduino libraries, but for HTTPS requests things are less straightforward. This class implements arbitrary HTTPS requests in a secure way, without requiring any specific certificates or fingerprints to be hard coded in the application. A full certificate store is automatically downloaded on build, and stored in PROGMEM.

### OTA Updates
Finally the framework provides a function to update the firmware on the ESP8266 from the browser. The firmware can be uploaded through the Browser to SPIFFS and then flashed to the device.

