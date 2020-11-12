#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "IPAddress.h"
#include "generated/config.h"

//data that needs to be persisted for other parts of the framework
struct internalData
{
    IPAddress ip;
    IPAddress gw;
    IPAddress sub;
};

class config
{

public:
    configData data;
    internalData internal;
    bool begin(int numBytes = 512);
    void saveRaw(uint8_t bytes[]);
    void saveExternal(configData *extData);
    void save();
    void reset();
};

extern config configManager;

#endif