#include "updater.h"

#ifdef ESP32
    #include "LITTLEFS.h"   // https://github.com/lorol/LITTLEFS/tree/master/examples/LITTLEFS_PlatformIO
    #include "Update.h"     // https://github.com/espressif/arduino-esp32/blob/master/libraries/Update/src/Update.h

    #define LittleFS LITTLEFS
#elif defined(ESP8266)
    #include "LittleFS.h"
#endif

void LittleFSUpdater::requestStart(String filenameIn)
{
    status = 254;
    filename = filenameIn;
    requestFlag = true;
}

void LittleFSUpdater::begin()
{
#ifdef ESP32
    // Ensure LITTLEFS is formatted on first use.  Default base path is /littlefs
    // See https://github.com/lorol/LITTLEFS/blob/f0817ca5264745acce697092de2bf218b3aa5b2e/examples/LITTLEFS_test/LITTLEFS_test.ino#L5
    Serial.println(PSTR("[D] LITTLEFS.begin(), calling"));
    if (!LITTLEFS.begin(false)) {
        Serial.println(PSTR("[I] LITTLEFS, unable to open, retry with formatting.."));

        if(!LITTLEFS.begin(/* formatOnFail */ true)){
            Serial.println(PSTR("[E] LITTLEFS Mount Failed"));
            return;
        }
    }
#endif
}

void LittleFSUpdater::loop()
{

    if (requestFlag==true)
    {
        requestFlag = false;
        flash(filename);
    }
}

uint8_t LittleFSUpdater::getStatus()
{
    return status;
}

void LittleFSUpdater::flash(String filename)
{    
    bool answer = 0;
    File file = LittleFS.open(filename, "r");

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
            Serial.println(PSTR("Update.writeStream..."));
            Update.writeStream(file);

            Serial.println(PSTR("Update.end..."));
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

        Serial.println(PSTR("file.close..."));
        file.close();
    }
    
    status = answer;
}

LittleFSUpdater updater;
