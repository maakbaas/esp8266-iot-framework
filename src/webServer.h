#ifndef SERVER_H
#define SERVER_H

#include <ESPAsyncWebServer.h>
#include <FS.h>

class webServer
{

private:    
    AsyncWebServer server = AsyncWebServer(80);

    static void handleFileUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final);
    static void serveProgmem(AsyncWebServerRequest *request);
    void bindAll();

public:
    void begin();
};

extern webServer GUI;

#endif
