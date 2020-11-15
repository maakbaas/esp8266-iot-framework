#ifndef DASHBOARD_H
#define DASHBOARD_H

#include <ESPAsyncWebServer.h>
#include "generated/dash.h"

class dashboard
{

private:
    static void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
    unsigned long loopRate = 0;
    unsigned long loopPrevious = 0;

public:
    void begin(int sampleTimeMs = 1000);
    void loop();
    dashboardData data;
};

extern dashboard dash;

#endif