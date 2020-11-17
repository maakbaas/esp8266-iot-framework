#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "configManager.h"
#include "dashboard.h"
#include "timeSync.h"

struct task
{    
    unsigned long rate;
    unsigned long previous;
};

task taskA = { .rate = 500, .previous = 0 };

void setup() 
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
    dash.begin(500);
}

void loop() 
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();
    dash.loop();

    //your code here
    //task A
    if (taskA.previous == 0 || (millis() - taskA.previous > taskA.rate))
    {
        taskA.previous = millis();

        String stringOne = "Apples";
        stringOne.toCharArray(dash.data.projectName,32);
        
        dash.data.dummyInt++;
        dash.data.inputInt++;

        dash.data.dummyFloat = sin((float)millis()/1000);

        if (dash.data.inputBool)
            dash.data.dummyBool = true;
        else
            dash.data.dummyBool = false;
    }
}
