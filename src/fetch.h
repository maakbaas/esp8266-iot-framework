#ifndef FETCH_H
#define FETCH_H

#include <Arduino.h>
#include "certStore.h"

class HTTPRequest
{

public:
    void begin();
    int request(String url);    

private:        
    BearSSL::CertStore certStore;
};

extern HTTPRequest fetch;

#endif