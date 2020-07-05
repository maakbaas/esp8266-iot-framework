#include "fetch.h"

#include <TZ.h>
#include <WiFiClientSecureBearSSL.h>
#include <coredecls.h> // settimeofday_cb defined
#include <PolledTimeout.h>

int HTTPRequest::setTime(const char* tz, const char* server1, const char* server2, const char* server3)
{
    bool time_set = false;

    settimeofday_cb([&time_set](){ time_set = true; }); // Set setimeofday() callback function
    configTime(tz, server1, server2, server3);

    using esp8266::polledTimeout::oneShotMs;
    oneShotMs timeout(10000); // Timeout in 10s
    while(!timeout)
    {
        if(time_set)
       	{
            return 0;
        }
	yield();
    }
    return -1;
}

int HTTPRequest::begin()
{
    return setTime(TZ_Etc_UTC, PSTR("0.pool.ntp.org"), PSTR("1.pool.ntp.org"), PSTR("2.pool.ntp.org"));
}

int HTTPRequest::begin(const char* tz)
{
    return setTime(tz, PSTR("0.pool.ntp.org"), PSTR("1.pool.ntp.org"), PSTR("2.pool.ntp.org"));
}

int HTTPRequest::begin(const char* tz, const char* server1, const char* server2, const char* server3)
{
    return setTime(tz, server1, server2, server3);
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
