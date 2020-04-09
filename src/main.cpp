#include <Arduino.h>
#include <FS.h>

#include "config.h"
#include "WiFiManager.h"
#include "webServer.h"

void setup() 
{
    Serial.begin(115200);

    SPIFFS.begin();

    GUI.begin();
    WiFiManager.begin(PROJECT_NAME);
}

void loop() 
{
    WiFiManager.loop();
}