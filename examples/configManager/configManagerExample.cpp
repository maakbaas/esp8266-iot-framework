#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"
#include "configManager.h"
#include "timeSync.h"

struct task
{
    unsigned long rate;
    unsigned long previous;
};

task taskA = {.rate = 60000, .previous = 0};

void saveCallback() {
    Serial.println("EEPROM saved"); 
}

void setup()
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    configManager.setConfigSaveCallback(saveCallback);
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
}

void loop()
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();
    configManager.loop();
    
    //task A
    if (taskA.previous == 0 || (millis() - taskA.previous > taskA.rate))
    {
        taskA.previous = millis();

        //option 1:
        //write directly to the configData ram mirror
        configManager.data.dummyInt++;

        //save the newest values in the EEPROM
        configManager.save();        


        //option 2:
        //create a new config data object
        //in this case make sure you set all values
        configData newData =
        {
            {.projectName2 = "Generic ESP8266 Firmware"},
            {.hostName = "ESP8266-01"},
            .dummyInt = configManager.data.dummyInt + 1,
            .dummyBool = true,
            .dummyFloat = 1.2345,
            .dummyString = "invisible!"
        };

        ///The saveExternal function copies the object to EEPROM
        configManager.saveExternal(&newData);

    }
}
