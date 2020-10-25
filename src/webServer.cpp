#include "webServer.h"
#include "ArduinoJson.h"

#ifdef ESP32

// TODO: Implement ESP32 version

#elif defined(ESP8266)

#include "LittleFS.h"

#endif

// Include the header file we create with webpack
#include "generated/html.h"

//Access to other classes for GUI functions
#include "WiFiManager.h"
#include "configManager.h"
#include "updater.h"

void webServer::begin()
{
#ifdef ESP32
    // TODO: Remove enter/exit traces after ESP32 build stable.  Experienced frequent crashing
    // during initial port when TCP stack not initialized before starting webserver instance.
    Serial.println("webServer::begin enter");
#endif

    //to enable testing and debugging of the interface
    DefaultHeaders::Instance().addHeader(PSTR("Access-Control-Allow-Origin"), PSTR("*"));

#ifdef ESP32
    // TODO: Implement ESP32 version
#elif defined(ESP8266)
    server.serveStatic("/download", LittleFS, "/");
#endif

    server.onNotFound(serveProgmem);

    //handle uploads
    server.on(PSTR("/upload"), HTTP_POST, [](AsyncWebServerRequest *request) {}, handleFileUpload);

    bindAll();

#ifdef ESP32
    Serial.println("Calling server.begin();  Will fail on ESP32 if tcp stack not initialized.  Ensure WiFiManager was called first.");
#endif
    server.begin();

#ifdef ESP32
   Serial.println("webServer::begin done.");
#endif
}

void webServer::bindAll()
{
    //Restart the ESP
    server.on(PSTR("/api/restart"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200, PSTR("text/html"), ""); //respond first because of restart
        ESP.restart();
    });

    //update WiFi details
    server.on(PSTR("/api/wifi/set"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200, PSTR("text/html"), ""); //respond first because of wifi change
        WiFiManager.setNewWifi(request->arg("ssid"), request->arg("pass"));
    });

    //update WiFi details
    server.on(PSTR("/api/wifi/forget"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200, PSTR("text/html"), ""); //respond first because of wifi change
        WiFiManager.forget();
    });

    //get WiFi details
    server.on(PSTR("/api/wifi/get"), HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<200> jsonBuffer;

        jsonBuffer["captivePortal"] = WiFiManager.isCaptivePortal();
        jsonBuffer["ssid"] = WiFiManager.SSID();
        jsonBuffer["hostName"] = WiFiManager.getHostName();
        jsonBuffer["ipAddress"] = WiFiManager.getIPAddress();
        jsonBuffer["macAddress"] = WiFiManager.getMacAddress();
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
    });

    //get file listing
    server.on(PSTR("/api/files/get"), HTTP_GET, [](AsyncWebServerRequest *request) {

#ifdef ESP32
        // TODO: Implement ESP32 version
        request->send(501, PSTR("text/html"), "TODO: Implement ESP32 version");
#elif defined(ESP8266)

        String JSON;
        StaticJsonDocument<1000> jsonBuffer;
        JsonArray files = jsonBuffer.createNestedArray("files");

        //get file listing
        Dir dir = LittleFS.openDir("");
        while (dir.next())
            files.add(dir.fileName());

        //get used and total data
        FSInfo fs_info;
        LittleFS.info(fs_info);
        jsonBuffer["used"] = String(fs_info.usedBytes);
        jsonBuffer["max"] = String(fs_info.totalBytes);
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
#endif

    });

    //remove file
    server.on(PSTR("/api/files/remove"), HTTP_POST, [](AsyncWebServerRequest *request) {
#ifdef ESP32
    // TODO: Implement ESP32 version
    request->send(501, PSTR("text/html"), "TODO: Implement ESP32 version");
#elif defined(ESP8266)
        LittleFS.remove("/" + request->arg("filename"));
        request->send(200, PSTR("text/html"), "");
#endif        
    });

    //update from LittleFS
    server.on(PSTR("/api/update"), HTTP_POST, [](AsyncWebServerRequest *request) {        
        updater.requestStart("/" + request->arg("filename"));
        request->send(200, PSTR("text/html"), "");
    });

    //update status
    server.on(PSTR("/api/update-status"), HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<200> jsonBuffer;

        jsonBuffer["status"] = updater.getStatus();
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
    });

    //send binary configuration data
    server.on(PSTR("/api/config/get"), HTTP_GET, [](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream(PSTR("application/octet-stream"));
        response->write(reinterpret_cast<char*>(&configManager.data), sizeof(configManager.data));
        request->send(response);
    });

    //receive binary configuration data from body
    server.on(
        PSTR("/api/config/set"), HTTP_POST,
        [this](AsyncWebServerRequest *request) {},
        [](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final) {},
        [this](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
            
            static uint8_t buffer[sizeof(configManager.data)];
            static uint32_t bufferIndex = 0;

            for (size_t i = 0; i < len; i++)
            {
                buffer[bufferIndex] = data[i];
                bufferIndex++;
            }

            if (index + len == total)
            {
                bufferIndex = 0;
                configManager.saveRaw(buffer);
                request->send(200, PSTR("text/html"), "");
            }

        });
}

// Callback for the html
void webServer::serveProgmem(AsyncWebServerRequest *request)
{    
    // Dump the byte array in PROGMEM with a 200 HTTP code (OK)
    AsyncWebServerResponse *response = request->beginResponse_P(200, PSTR("text/html"), html, html_len);

    // Tell the browswer the content is Gzipped
    response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
    
    request->send(response);    
}

void webServer::handleFileUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
#ifdef ESP32

    // TODO: Implement ESP32 version

#elif defined(ESP8266)

    static File fsUploadFile;

    if (!index)
    {
        Serial.println(PSTR("Start file upload"));
        Serial.println(filename);

        if (!filename.startsWith("/"))
            filename = "/" + filename;

        fsUploadFile = LittleFS.open(filename, "w");
    }

    for (size_t i = 0; i < len; i++)
    {
        fsUploadFile.write(data[i]);
    }

    if (final)
    {
        String JSON;
        StaticJsonDocument<100> jsonBuffer;

        jsonBuffer["success"] = fsUploadFile.isFile();
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
        fsUploadFile.close();        
    }

#endif    

}

webServer GUI;