#include "fetch.h"
#include <WiFiClientSecureBearSSL.h>
#include <ESP8266HTTPClient.h>

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

int HTTPRequest::request(String url)
{
    HTTPClient *http = new HTTPClient();
    WiFiClient *client = new WiFiClient();
    BearSSL::WiFiClientSecure *httpsClient = new BearSSL::WiFiClientSecure();

    if (url[4] == 's')
    {        
        httpsClient->setCertStore(&certStore);
        http->begin(dynamic_cast<WiFiClient &>(*httpsClient), url);
    }
    else
    {
        http->begin(*client, url);        
    }
            
    int result = http->GET();

    delete http;
    delete client;
    delete httpsClient;    

    return result;

}

HTTPRequest fetch;