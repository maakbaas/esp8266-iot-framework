#include "fetch.h"

#include <WiFiClientSecureBearSSL.h>

void HTTPRequest::begin(String url) 
{
    http = new HTTPClient();

    if (url[4] == 's')
    {
        httpsClient = new BearSSL::WiFiClientSecure();

        //try MFLN to reduce memory need
        if (httpsClient->probeMaxFragmentLength(url, 443, 512))
        {
            Serial.println(PSTR("MFLN supported"));
            httpsClient->setBufferSizes(512, 512);
        }

        httpsClient->setCertStore(&certStore);
        http->begin(*httpsClient, url);
                
        client = httpsClient;
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
    Serial.println(ESP.getFreeHeap());
    begin(url);
    Serial.println(ESP.getFreeHeap());
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
