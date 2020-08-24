#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>
#include <ESP8266HTTPClient.h>

#include "certStore.h"

class HTTPRequest
{

public:
    void clean();

    void begin(String url, bool useMFLN);

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
    BearSSL::WiFiClientSecure *httpsClient;
};

extern HTTPRequest fetch;

#endif
