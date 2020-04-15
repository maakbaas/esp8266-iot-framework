#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

class HTTPRequest
{

public:
    void begin();
    int request(String url);
    HTTPClient http;

private:
    BearSSL::WiFiClientSecure *httpsClient = new BearSSL::WiFiClientSecure();
    WiFiClient httpClient;
    CertStore certStore;
};

extern HTTPRequest fetch;

#endif