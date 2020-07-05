#include <Arduino.h>
#include "LittleFS.h"
#include <TZ.h>

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"
#include "configManager.h"

struct task
{    
    unsigned long rate;
    unsigned long previous;
};

task taskA = { .rate = 5000, .previous = 0 };

void setup() 
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    fetch.begin(TZ_Europe_Amsterdam, "ntp.time.nl");
}

void loop() 
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();

    //task A
    if (taskA.previous==0 || (millis() - taskA.previous > taskA.rate ))
    {
        taskA.previous = millis();

        //do task
        Serial.println(ESP.getFreeHeap());
                
        // fetch.GET("https://www.google.com");

        // while (fetch.busy())
        // {
        //     if (fetch.available())
        //     {
        //         Serial.write(fetch.read());           
        //     }
        // }
        
        // fetch.clean();
    }
}
