#ifndef WIFI_H
#define WIFI_H

#include <Arduino.h>
#include <DNSServer.h>
#include <memory>

class WifiManager
{

private:
    std::unique_ptr<DNSServer> dnsServer;
    String ssid;
    String pass;
    bool reconnect = false;
    bool inCaptivePortal = false;
    char const *captivePortalName;
    
    void startCaptivePortal(char const *apName);
    void stopCaptivePortal();
    void connectNewWifi(String newSSID, String newPass);    

public : 
    void begin(char const *apName);
    void loop();
    void forget();
    bool isCaptivePortal();
    String SSID();
    void setNewWifi(String newSSID, String newPass);
};

extern WifiManager WiFiManager;

#endif


