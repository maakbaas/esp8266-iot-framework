#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "generated/config.h"

class config
{

public:
    configData data;
    bool begin(int numBytes = 512);
    void saveRaw(uint8_t test[]);
    void save();
};

extern config configManager;

#endif