# Web Server

The web server is based on ESPAsyncWebServer and presents the web interface which is needed to configure WiFi and other settings from the browser. This web interface is developed in React (currently ~40Kb gzipped), and communicates with the ESP8266 through an API. To be able to get and set information from this API, the web server class will interact with the other framework modules. The GUI content is merged into a single gzipped file, which is then converted into a byte array and stored in the ESP8266 PROGMEM.
