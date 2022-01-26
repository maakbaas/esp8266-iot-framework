#include "fetch.h"

#ifdef ESP32

// TODO: Implement ESP32 version

#elif defined(ESP8266)

#include <WiFiClientSecureBearSSL.h>

#endif

void HTTPRequest::begin(String url, bool useMFLN) 
{
    http = new HTTPClient();

    if (url[4] == 's')
    {
#ifdef ESP32
        // TODO: Implement ESP32 version
        client = new WiFiClient();  // TODO: Should use ESP32 secure client instead
        http->begin(*client, url);
#elif defined(ESP8266)
        httpsClient = new BearSSL::WiFiClientSecure();

        //try MFLN to reduce memory need
        if (useMFLN && httpsClient->probeMaxFragmentLength(url, 443, 512))
        {
            Serial.println(PSTR("MFLN supported"));
            httpsClient->setBufferSizes(512, 512);
        }

        httpsClient->setCertStore(&certStore);
        http->begin(*httpsClient, url);
                
        client = httpsClient;
#endif        
    }
    else
    {
        client = new WiFiClient();
        http->begin(*client, url);
    }

    http->setReuse(false);
}

int HTTPRequest::GET(String url)
{
    begin(url);
    return http->GET();
}

int HTTPRequest::GET()
{
    return http->GET();
}

int HTTPRequest::POST(String url, String body)
{
    begin(url);
    return http->POST(body);
}

int HTTPRequest::POST(String body)
{
    return http->POST(body);
}

int HTTPRequest::PUT(String url, String body)
{
    begin(url);
    return http->PUT(body);
}

int HTTPRequest::PUT(String body)
{
    return http->PUT(body);
}

int HTTPRequest::PATCH(String url, String body)
{
    begin(url);
    return http->PATCH(body);
}

int HTTPRequest::PATCH(String body)
{
    return http->PATCH(body);
}

int HTTPRequest::DELETE(String url)
{
    begin(url);
    return http->sendRequest("DELETE");
}

int HTTPRequest::DELETE()
{
    return http->sendRequest("DELETE");
}

bool HTTPRequest::busy()
{
    return (client->connected() || client->available());
}

bool HTTPRequest::available()
{
    return client->available();
}

uint8_t HTTPRequest::read()
{
    return client->read();
}

String HTTPRequest::readString()
{
    return client->readString();
}

void HTTPRequest::clean()
{
    delete http;
    delete client;
}

void HTTPRequest::setAuthorization(const char * user, const char * password)
{
    http->setAuthorization(user, password);
}

void HTTPRequest::setAuthorization(const char * auth)
{
    http->setAuthorization(auth);
}

void HTTPRequest::addHeader(String name, String value)
{
    http->addHeader(name, value);
}

HTTPRequest fetch;
