# esp8266-firmware
Generic Firmware to use as a starting point for different ESP8266 projects

The current initial version of the firmware contains the following functionality:

* The WiFiManager class handles WiFi connections. If possible to connect to stored credentials it will do so, otherwise it will create a captive portal. It is also possible to change the WiFi credentials on the fly without rebooting the ESP8266.
* The webServer class is based on ESPAsyncWebServer and serves the GUI to the browser that currently allows you to change your WiFi settings. This GUI is split from the WiFi manager on purpose in order to have a better integration with potential other GUI functions.
* The bundled GUI is based on Preact to be able to use modern techniques to write the GUI while still keeping the bundle size small (currently <30Kb gzipped). 
* The webpack setup is fully automated to merge all GUI content into a single gzipped file, which is then converted into a byte array to be able to store it in PROGMEM on the ESP8266, removing the need for SPIFFS usage.
