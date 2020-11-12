#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "IPAddress.h"
#include "generated/config.h"

//data that needs to be persisted for other parts of the framework

#define SIZE_INTERNAL 32 //allocate 32 bytes to have room for future expansion

struct internalData
{
    uint32_t ip;
    uint32_t gw;
    uint32_t sub;
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

private:
    uint8_t checksum(uint8_t *byteArray, unsigned long length);
};

extern config configManager;

#endif