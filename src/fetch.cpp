#include "fetch.h"

#include <WiFiClientSecureBearSSL.h>

void HTTPRequest::beginRequest(String &url) 
{
    http = new HTTPClient();

    if (url[4] == 's')
    {
        httpsClient = new BearSSL::WiFiClientSecure();
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
    beginRequest(url);
    return http->GET();
}

int HTTPRequest::POST(String url, String body)
{
    beginRequest(url);
    return http->POST(body);
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

HTTPRequest fetch;
