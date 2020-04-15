#include <Arduino.h>
#include <FS.h>

#include "config.h"
#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"

void setup() 
{
    Serial.begin(115200);

    SPIFFS.begin();

    GUI.begin();
    WiFiManager.begin(PROJECT_NAME); 
    fetch.begin();
}

void loop() 
{
    WiFiManager.loop();
    updater.loop();
}