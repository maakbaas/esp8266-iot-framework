#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>

#ifdef ESP32
    #include <WiFi.h>
    #include <HTTPClient.h>
#elif defined(ESP8266)
    #include <ESP8266HTTPClient.h>
#endif

#include "certStore.h"

class HTTPRequest
{

public:
    void clean();

    void begin(String url, bool useMFLN = false);

    int GET(String url);
    int GET();
    int POST(String url, String body);
    int POST(String body);
    int PUT(String url, String body);
    int PUT(String body);
    int PATCH(String url, String body);
    int PATCH(String body);
    int DELETE(String url);
    int DELETE();
    
    bool busy();
    bool available();
    uint8_t read();
    String readString();
    
    void setAuthorization(const char * user, const char * password);
    void setAuthorization(const char * auth);
    void addHeader(String name, String value);

private : 
    BearSSL::CertStore certStore;

    HTTPClient *http;
    WiFiClient *client;
#ifdef ESP32
    // TODO: Implement ESP32 version
#elif defined(ESP8266)
    BearSSL::WiFiClientSecure *httpsClient;
#endif

};

extern HTTPRequest fetch;

#endif
