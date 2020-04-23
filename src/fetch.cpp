#include "fetch.h"

#include <WiFiClientSecureBearSSL.h>

void HTTPRequest::begin()
{
    configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println(PSTR("Waiting for NTP time sync: "));
    time_t now = time(nullptr);
    while (now < 8 * 3600 * 2)
    {
        delay(500);
        now = time(nullptr);
    }
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);
    Serial.print(PSTR("Current GMT time: "));
    Serial.print(asctime(&timeinfo)); 
}

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

void HTTPRequest::clean()
{
    delete http;
    delete client;
}

HTTPRequest fetch;