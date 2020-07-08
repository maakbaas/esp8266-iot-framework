#include "timeSync.h"

#include <TZ.h>
#include <coredecls.h>
#include <PolledTimeout.h>

void NTPSync::begin()
{
    setTime(TZ_Etc_UTC, "0.pool.ntp.org", "1.pool.ntp.org", "2.pool.ntp.org");
}

void NTPSync::begin(const char* tz)
{
    setTime(tz, "0.pool.ntp.org", "1.pool.ntp.org", "2.pool.ntp.org");
}

void NTPSync::begin(const char* tz, const char* server1, const char* server2, const char* server3)
{
    setTime(tz, server1, server2, server3);
}

bool NTPSync::isSynced()
{
    return synced; 
}

int8_t NTPSync::waitForSyncResult(unsigned long timeoutLength)
{
    if (synced)
    {
        return 0;
    }

    using esp8266::polledTimeout::oneShot;
    oneShot timeout(timeoutLength);
    while(!timeout)
    {
        yield();
        if(synced)
        {
            return 0;
        }
    }
    return -1;
}

void NTPSync::setTime(const char* tz, const char* server1, const char* server2, const char* server3)
{
    settimeofday_cb([this](){ synced = true; });
    configTime(tz, server1, server2, server3);
}

NTPSync timeSync;
