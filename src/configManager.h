#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include <Arduino.h>

//the structure of the configuration
struct configData
{
    char projectName[32];
};

class config
{

public:
    configData data;
    bool begin(int numBytes = 512);
    void save();
};

extern config configManager;

#endif