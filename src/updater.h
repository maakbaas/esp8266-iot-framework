#ifndef UPDATER_H
#define UPDATER_H

#include <Arduino.h>

class SPIFFSUpdater
{

private:
    String filename;
    bool requestFlag = false;
    bool flash(String filename);

public:
    void requestStart(String filename);
    void loop();
};

extern SPIFFSUpdater updater;

#endif