#include <EEPROM.h>

#include "configManager.h"

//class functions
bool config::begin(int numBytes)
{
    EEPROM.begin(numBytes);

    uint32_t storedVersion;
    EEPROM.get(0, storedVersion);
    if (storedVersion != configVersion)
    {        
        reset();
        return false;
    }
    else
    {
        EEPROM.get(4, data);

        return true;
    }
    
}

void config::reset()
{
    memcpy_P(&data, &defaults, sizeof(data));
    save();
}

void config::saveRaw(uint8_t bytes[])
{
    memcpy(&data,bytes,sizeof(data));
    save();
}

void config::saveExternal(configData *extData)
{
    memcpy(&data, extData, sizeof(data));
    save();
}

void config::save()
{
    EEPROM.put(0, configVersion);
    EEPROM.put(4, data);
    EEPROM.commit();
}

config configManager;