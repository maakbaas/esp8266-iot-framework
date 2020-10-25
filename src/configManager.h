#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "generated/config.h"

class config
{

public:
    configData data;

    bool begin(int numBytes = 512);
    void saveRaw(uint8_t newData[]);
    void saveExternal(configData *extData);
    void save();
    void reset();
    bool hasConfigChanged();

private:
    bool _hasConfigChanged = false;
};

extern config configManager;

#endif