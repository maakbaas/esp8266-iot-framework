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
    
    void startCaptivePortal(char const *apName);
    void stopCaptivePortal();
    void connectNewWifi(String newSSID, String newPass);    
    void storeToEEPROM();
    int8_t waitForConnectResult(unsigned long timeoutLength);
    std::function<void()> _captiveportalstopcallback;
    std::function<void()> _captiveportalstartcallback;    

public : 
    void begin(char const *apName, unsigned long newTimeout = 60000);
    void loop();
    void forget();
    bool isCaptivePortal();
    String SSID();
    void setNewWifi(String newSSID, String newPass);
    void setNewWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns);
    void stoppedCaptivePortal( std::function<void()> func );
    void startedCaptivePortal( std::function<void()> func );

};

extern WifiManager WiFiManager;

#endif


