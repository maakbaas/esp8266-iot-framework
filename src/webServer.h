#ifndef SERVER_H
#define SERVER_H

// TODO: Implement ESP32 version
// #ifdef ESP32
// #include <WiFi.h>
// #include <AsyncTCP.h>
// #elif defined(ESP8266)
// #include <ESP8266WiFi.h>
// #include <ESPAsyncTCP.h>
// #endif
#include <ESPAsyncWebServer.h>

class webServer
{

private:    
    static void handleFileUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final);
    static void serveProgmem(AsyncWebServerRequest *request);
    void bindAll();

public:
    AsyncWebServer server = AsyncWebServer(80);
    AsyncWebSocket ws = AsyncWebSocket("/ws");
    ArRequestHandlerFunction requestHandler = serveProgmem;
    void begin();
};

extern webServer GUI;

#endif
