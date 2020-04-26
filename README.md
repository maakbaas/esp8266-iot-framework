# ESP8266 Generic Firmware
Generic Firmware to use as a starting point for different ESP8266 projects

The current initial version of the firmware contains the following functionality:

* The WiFiManager class handles WiFi connections. If possible to connect to stored credentials it will do so, otherwise it will create a captive portal. It is also possible to change the WiFi credentials on the fly without rebooting the ESP8266.
* The webServer class is based on ESPAsyncWebServer and serves the GUI to the browser that currently allows you to change your WiFi settings. This GUI is split from the WiFi manager on purpose in order to have a better integration with potential other GUI functions.
* SPIFFS file manager from the GUI
* Configuration manager that is generated from a JSON file. The configuration manager stores a struct with configuration data in the EEPROM. Structure can be changed at build time, data can be changed at runtime through the GUI which is also auto generated from the JSON
* Firmware update through the Browser. Upload a file to SPIFFS and flash it to the device
* HTTP and HTTPS requests using a full certificate store for a correct SSL implementation. Certificates automatically downloaded on build, and stored in PROGMEM.
* The bundled GUI is based on Preact to be able to use modern techniques to write the GUI while still keeping the bundle size small (currently ~30Kb gzipped). 
* The webpack setup is fully automated to merge all GUI content into a single gzipped file, which is then converted into a byte array to be able to store it in PROGMEM on the ESP8266, removing the need for SPIFFS usage. This process is also integrated with PlatformIO so that each new build automatically integrates the latest version of the GUI.
