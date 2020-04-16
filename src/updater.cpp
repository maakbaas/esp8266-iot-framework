#include "updater.h"

#include <FS.h>

void SPIFFSUpdater::requestStart(String filenameIn) 
{
    filename = filenameIn;
    requestFlag = true;
}

void SPIFFSUpdater::loop()
{
    if (requestFlag==true)
    {
        requestFlag = false;
        flash(filename);
    }
}

bool SPIFFSUpdater::flash(String filename)
{
    bool answer = false;
    File file = SPIFFS.open(filename, "r");

    if (!file)
    {
        Serial.println(PSTR("Failed to open file for reading"));
        return false;
    }

    Serial.println(PSTR("Starting update.."));

    size_t fileSize = file.size();

    if (!Update.begin(fileSize))
    {

        Serial.println(PSTR("Not enough space for update"));
        }
    else
    {
        Update.writeStream(file);

        if (Update.end())
        {
            Serial.println(PSTR("Successful update"));
            answer = true;
        }
        else
        {

            Serial.println(PSTR("Error Occurred: ") + String(Update.getError()));
        }        
    }

    file.close();

    if (answer==true)
    {
        ESP.restart();
    }
    
    return answer;
}

SPIFFSUpdater updater;

