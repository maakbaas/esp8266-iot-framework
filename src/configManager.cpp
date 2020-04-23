#include <EEPROM.h>

#include "configManager.h"

//version of the configuration structure.
//change this number when the structure changes
uint16_t configVersion = 0x1234;

//the default values for the configuration
const configData defaults PROGMEM =
{
    "Generic ESP8266 Firmware"
};

//class functions
bool config::begin(int numBytes)
{
    EEPROM.begin(numBytes);

    uint16_t storedVersion;
    EEPROM.get(0, storedVersion);
    if (storedVersion != configVersion)
    {
        memcpy_P(&data, &defaults, sizeof(data));
        save();

        return false;
    }
    else
    {
        EEPROM.get(2, data);

        return true;
    }
    
}

void config::save()
{
    EEPROM.put(0, configVersion);
    EEPROM.put(2, data);
    EEPROM.commit();
}

config configManager;