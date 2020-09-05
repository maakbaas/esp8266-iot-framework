#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "generated/config.h"

class config
{

public:
    configData data;
    bool begin(int numBytes = 512);
    void saveRaw(uint8_t bytes[]);
    void saveExternal(configData *extData);
    void save();
    void reset();

};

extern config configManager;

#endif