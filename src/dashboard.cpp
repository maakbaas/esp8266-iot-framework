#include "dashboard.h"
#include "webServer.h"

void dashboard::begin(int sampleTimeMs)
{
    GUI.ws.onEvent(onWsEvent);
    loopRate = sampleTimeMs;
}

void dashboard::loop()
{
    if (loopPrevious == 0 || (millis() - loopPrevious > loopRate))
    {
        loopPrevious = millis();

        send();
    }
}

void dashboard::send()
{
    //send data, first 32bit timestamp and then the binary data structure
    uint8_t buffer[sizeof(data) + 4];

    unsigned long now = millis();
    memcpy(buffer, reinterpret_cast<uint8_t *>(&now), 4);

    memcpy(buffer + 4, reinterpret_cast<uint8_t *>(&data), sizeof(data));

    GUI.ws.binaryAll(buffer, sizeof(buffer));
}

void dashboard::onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *dataIn, size_t len)
{
    /* initialize new client */
    if (type == WS_EVT_CONNECT)
    {
        Serial.println("New WS client");
    }
    else if (type == WS_EVT_DISCONNECT)
    {
        Serial.println("Lost WS client");
    }
}

dashboard dash;