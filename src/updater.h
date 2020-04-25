#ifndef UPDATER_H
#define UPDATER_H

#include <Arduino.h>

class SPIFFSUpdater
{

private:
    String filename;
    bool requestFlag = false;
    uint8_t status = 255;
    void flash(String filename);

public:
    void requestStart(String filename);
    void loop();
    uint8_t getStatus();
};

extern SPIFFSUpdater updater;

#endif