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

int HTTPRequest::GET(String url, WiFiClient *&outputClient)
{
    http = new HTTPClient();
    client = new WiFiClient();
    httpsClient = new BearSSL::WiFiClientSecure();

    if (url[4] == 's')
    {        
        httpsClient->setCertStore(&certStore);
        http->begin(*httpsClient, url);
        outputClient = httpsClient;
    }
    else
    {
        http->begin(*client, url);
        outputClient = client;
    }

    return http->GET();

}

void HTTPRequest::clean()
{
    delete http;
    delete client;
    delete httpsClient;
}

HTTPRequest fetch;