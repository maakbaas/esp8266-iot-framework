#ifndef TIMESYNC_H
#define TIMESYNC_H

#include <Arduino.h>

class NTPSync
{

public:
    void begin();
    void begin(const char* tz);
    void begin(const char* tz, const char* server1, const char* server2 = nullptr, const char* server3 = nullptr);
    bool isSynced();
    int8_t waitForSyncResult(unsigned long timeoutLength = 10000);

private : 
    bool synced = false;

    void setTime(const char* tz, const char* server1, const char* server2, const char* server3);
};

extern NTPSync timeSync;

#endif
