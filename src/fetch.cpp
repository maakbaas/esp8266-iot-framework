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

int HTTPRequest::GET(String url)
{
    http = new HTTPClient();
    
    if (url[4] == 's')
    {
        httpsClient = new BearSSL::WiFiClientSecure();
        httpsClient->setCertStore(&certStore);
        http->begin(*httpsClient, url);
        outputClient = httpsClient;
    }
    else
    {
        client = new WiFiClient();
        http->begin(*client, url);
        outputClient = client;
    }

    http->setReuse(false);
    int status = http->GET();
    return status;

}

bool HTTPRequest::busy()
{
    return (outputClient->connected() || outputClient->available());
}

bool HTTPRequest::available()
{
    return outputClient->available();
}

uint8_t HTTPRequest::read()
{
    return outputClient->read();
}

void HTTPRequest::clean()
{
    delete http;
    delete client;
    delete httpsClient;
}

HTTPRequest fetch;