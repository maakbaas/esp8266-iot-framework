#include "fetch.h"

void HTTPRequest::begin()
{
    configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
    Serial.print("Waiting for NTP time sync: ");
    time_t now = time(nullptr);
    while (now < 8 * 3600 * 2)
    {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("");
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);
    Serial.print("Current GMT time: ");
    Serial.print(asctime(&timeinfo));

    certStore.initCertStore(SPIFFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
    httpsClient->setCertStore(&certStore);
}

int HTTPRequest::request(String url)
{
    if (url[4] == 's')
    {
        http.begin(dynamic_cast<WiFiClient &>(*httpsClient), url);
    }
    else
    {
        http.begin(httpClient, url);
    }
    
    return http.GET();
}

HTTPRequest fetch;