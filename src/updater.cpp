#include "updater.h"

#include <FS.h>

void SPIFFSUpdater::requestStart(String filenameIn) 
{
    status = 254;
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

uint8_t SPIFFSUpdater::getStatus() 
{
    return status;
}

void SPIFFSUpdater::flash(String filename)
{    
    bool answer = 0;
    File file = SPIFFS.open(filename, "r");

    if (!file)
    {
        Serial.println(PSTR("Failed to open file for reading"));
        answer = 0;
    }
    else
    {
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
                answer = 1;
            }
            else
            {

                Serial.println(PSTR("Error Occurred: ") + String(Update.getError()));
            }
        }

        file.close();
    }
    
    status = answer;
}

SPIFFSUpdater updater;

