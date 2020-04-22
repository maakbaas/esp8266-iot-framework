#include <Arduino.h>
#include <FS.h>

#include "config.h"
#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"

unsigned long prev_time_task;

void setup() 
{
    Serial.begin(115200);

    SPIFFS.begin();
    GUI.begin();
    WiFiManager.begin(PSTR(PROJECT_NAME));
    fetch.begin();
}

void loop() 
{
    WiFiManager.loop();
    updater.loop();

    //background task
    if (millis() - prev_time_task > 10000)
    {
        prev_time_task = millis();

        //do task
        Serial.println(ESP.getFreeHeap());
        WiFiClient *result = NULL;
        fetch.GET("https://www.google.com", result);
        while (result->available())
            Serial.write(result->read());           
        fetch.clean();
    }
}