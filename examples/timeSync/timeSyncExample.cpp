#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"
#include "configManager.h"
#include "timeSync.h"
#include <TZ.h>

void setup()
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    updater.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);

    //Set the timezone to Amsterdam
    timeSync.begin(TZ_Europe_Amsterdam);

    //Wait for connection
    timeSync.waitForSyncResult(10000);

    if (timeSync.isSynced())
    {
        time_t now = time(nullptr);
        Serial.print(PSTR("Current time in Amsterdam: "));
        Serial.print(asctime(localtime(&now)));
    }
    else 
    {
        Serial.println("Timeout while receiving the time");
    }
}

void loop()
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();    
    configManager.loop();
}
