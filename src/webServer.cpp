
#include "webServer.h"
#include "ArduinoJson.h"

// Include the header file we create with webpack
#include "html.h"

//Access to other classes for GUI functions
#include "WiFiManager.h"


void webServer::begin()
{
    //to enable testing and debugging of the interface
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");

    server.begin();

    server.onNotFound(serveProgmem);

    //handle uploads
    server.on("/upload", HTTP_POST, [](AsyncWebServerRequest *request) { request->send(200); },
        handleFileUpload);

    bindAll();
}

void webServer::bindAll()
{
    //update WiFi details
    server.on("/api/wifi/set", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "text/html", "");
        WiFiManager.setNewWifi(request->arg("ssid"), request->arg("pass"));
    });

    //update WiFi details
    server.on("/api/wifi/forget", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "text/html", "");
        WiFiManager.forget();
    });

    //get WiFi details
    server.on("/api/wifi/get", HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<200> jsonBuffer;

        jsonBuffer["captivePortal"] = WiFiManager.isCaptivePortal();
        jsonBuffer["ssid"] = WiFiManager.SSID();
        serializeJson(jsonBuffer, JSON);

        request->send(200, "text/html", JSON);
    });

    //get file listing
    server.on("/api/files/get", HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<1000> jsonBuffer;
        JsonArray files = jsonBuffer.createNestedArray("files");

        //get file listing
        Dir dir = SPIFFS.openDir("");
        while (dir.next())
            files.add(dir.fileName().substring(1));

        //get used and total data
        FSInfo fs_info;
        SPIFFS.info(fs_info);
        jsonBuffer["used"] = String(fs_info.usedBytes);
        jsonBuffer["max"] = String(fs_info.totalBytes);

        serializeJson(jsonBuffer, JSON);

        request->send(200, "text/html", JSON);
    });

    //remove file
    server.on("/api/files/remove", HTTP_GET, [](AsyncWebServerRequest *request) {
        SPIFFS.remove("/" + request->arg("filename"));
        request->send(200, "text/html", "");
    });
}

// Callback for the html
void webServer::serveProgmem(AsyncWebServerRequest *request)
{    
    // Dump the byte array in PROGMEM with a 200 HTTP code (OK)
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", html, html_len);

    // Tell the browswer the content is Gzipped
    response->addHeader("Content-Encoding", "gzip");
    
    request->send(response);    
}

void webServer::handleFileUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
    static File fsUploadFile;

    if (!index)
    {
        Serial.println("Start file upload");
        Serial.println(filename);

        if (!filename.startsWith("/"))
            filename = "/" + filename;

        fsUploadFile = SPIFFS.open(filename, "w");
    }

    for (size_t i = 0; i < len; i++)
    {
        fsUploadFile.write(data[i]);
    }

    if (final)
    {
        fsUploadFile.close();
    }
}

webServer GUI;