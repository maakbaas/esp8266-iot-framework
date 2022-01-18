#ifndef WIFI_H
#define WIFI_H

#include <Arduino.h>
#include <DNSServer.h>
#include <memory>

class WifiManager
{

private:
    DNSServer *dnsServer;
    String ssid;
    String pass;
    IPAddress ip;
    IPAddress gw;
    IPAddress sub;
    IPAddress dns;
    bool reconnect = false;
    bool inCaptivePortal = false;
    char const *captivePortalName;
    unsigned long timeout = 60000;
    char const *hostName;
    
    void startCaptivePortal(char const *apName);
    void stopCaptivePortal();
    void connectNewWifi(String newSSID, String newPass);    
    void storeToEEPROM();
    int8_t waitForConnectResult(unsigned long timeoutLength);

public : 
    void begin(char const *apName, unsigned long newTimeout = 60000, char const *hostName = NULL);
    void loop();
    void forget();
    bool isCaptivePortal();
    String SSID();
    String getHostName();
    String getIPAddress();
    String getMacAddress();    
    void setNewWifi(String newSSID, String newPass);
    void setNewWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns);
};

extern WifiManager WiFiManager;

#endif


