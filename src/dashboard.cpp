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
        
        //send data, first 32bit timestamp and then the binary data structure
        uint8_t buffer[sizeof(data) + 8];

        unsigned long now = millis();
        memcpy(buffer, reinterpret_cast<uint8_t *>(&now), 8);
        
        memcpy(buffer + 8, reinterpret_cast<uint8_t *>(&data), sizeof(data));

        GUI.ws.binaryAll(buffer, sizeof(buffer));
    }
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
    else if (type == WS_EVT_DATA)
    {
        //receive binary data packet
        AwsFrameInfo *info = (AwsFrameInfo *)arg;
        if (info->final && info->index == 0 && info->len == len)
        {
            if (info->opcode == WS_BINARY)
            {
                static uint8_t buffer[sizeof(data)];

                for (size_t i = 0; i < info->len; i++)
                {
                    buffer[i] = dataIn[i];
                }

                memcpy(&(dash.data), buffer, sizeof(buffer));
            }            
        }
    }
}

dashboard dash;