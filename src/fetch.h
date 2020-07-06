#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>
#include <ESP8266HTTPClient.h>

#include "certStore.h"
#include "fetch_definitions.h"

class HTTPRequest
{

public:
    void clean();
    int GET(String url);
    int POST(String url, String body);
    bool busy();
    bool available();
    uint8_t read();
    String readString();
    fetch_status_t begin();
    fetch_status_t begin(const char* tz);
    fetch_status_t begin(const char* tz, const char* server1, const char* server2 = nullptr, const char* server3 = nullptr);

private : 
    BearSSL::CertStore certStore;

    HTTPClient *http;
    WiFiClient *client;
    BearSSL::WiFiClientSecure *httpsClient;

    void beginRequest(String &url);
    fetch_status_t setTime(const char* tz, const char* server1, const char* server2, const char* server3);
};

extern HTTPRequest fetch;

#endif
