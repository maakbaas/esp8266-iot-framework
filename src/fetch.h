#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>
#include <ESP8266HTTPClient.h>

#include "CertStoreBearSSL.h"
#include <ESP8266WiFi.h>

class HTTPRequest
{

public:
    void begin();
    int request(String url);    

private:        
    CertStore certStore;
};

extern HTTPRequest fetch;

#endif