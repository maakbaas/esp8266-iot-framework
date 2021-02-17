# Web Server

The web server is based on ESPAsyncWebServer and presents the web interface which is needed to configure WiFi and other settings from the browser. This web interface is developed in React (currently ~120Kb gzipped), and communicates with the ESP8266 through an API. To be able to get and set information from this API, the web server class will interact with the other framework modules. The GUI content is merged into a single gzipped file, which is then converted into a byte array and stored in the ESP8266 PROGMEM.

## Class Methods

#### begin

```c++
void begin();
```

The web server has only one public method. Call this method in your setup function to initialize and start the web server.

## Class Members

#### server

```c++
AsyncWebServer server = AsyncWebServer(80);
```

The server object is made public so that you can add your own API methods/callbacks.

#### ws

```c++
AsyncWebSocket ws = AsyncWebSocket("/ws");
```

The websocket object is public so that it can be accessed from other parts of the framework.

## Web Server

The basic setup of the webserver is done with three simple rules, which are described below.

```c++
server.serveStatic("/download", LittleFS, "/");
server.onNotFound(serveProgmem);
server.on(PSTR("/upload"), HTTP_POST, [](AsyncWebServerRequest *request) {}, handleFileUpload)
```

#### /download/\*.\*

Requests to URL's containing the download folder will attempt to load the filename `*.*` from the LittleFS memory and serve it to the browser

#### /upload

With a POST request to this URL you can upload a file to the LittleFS filesystem

#### onNotFound

For all requested URL's that do not exist (this includes the root URL), the web interface will be loaded and served to the user. This web interface is served from a PROGMEM byte array which is generated with Webpack during the NPM build process.

## API Implementation

Next to the basic implementation an API is implemented by the web server class. The web server has a private method `bindAll()` in which all API functions are added which can be called from the web interface with `GET` or `POST` requests. The current supported functions are described below.

#### /api/restart

A request of this URL restarts the ESP8266.

#### /api/wifi/set

A GET request to this location with the arguments `ssid` and `pass` tries to connect to these new WiFi credentials.

#### /api/wifi/setStatic

A GET request to this location with the arguments `ssid`, `pass`, `ip`, `sub` and `gw` tries to connect to these new WiFi credentials with a static IP address.

#### /api/wifi/forget

A request to this URL will forget the stored WiFi details and start a captive portal.

#### /api/wifi/get

A request to this URL will return a JSON object containing a flag if the ESP8266 is currently acting as a hotpot, and if not, the current SSID name.

#### /api/files/get

A request to this URL will return an object containing all the filenames currently stored in the LittleFS as well as the maximum and currently used memory in bytes.

#### /api/files/remove

A request to this URL with the argument `filename` will attempt to delete that file.

#### /api/update

A request to this URL will try to update the firmware to the file specified in `filename`.

#### /api/update-status

A request to this URL will return the status of the update process. The status is 255 when no update is requested, 254 when an update is ongoing, 0 when the update has failed and 1 when the update was successful

#### /api/config/get

A call to this URL returns a raw binary representation of the configuration object to be processed in Javascript. More information on this can be found [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md).

#### /api/config/set

A POST request to this URL with again the binary representation of an updated configuration object will attempt to update the configuration data in EEPROM accordingly. More information on this can be found [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md).

#### /api/dash/set

A POST request to this URL with the binary representation of an updated dashboard object member, its offset pointer location from the start of the dashboard structure and its length will update the dashboard data accordingly. More information on this can be found [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/dashboard.md).
