#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "generated/config.h"

class config
{

public:
    configData data;

    bool begin(int numBytes = 512);
    void saveRaw(uint8_t newData[]);
    void update(uint8_t newData[]);
    void reset();
    bool hasConfigChanged();

private:
    void save();
    bool _hasConfigChanged = false;
};

extern config configManager;

#endif