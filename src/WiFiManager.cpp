//inspired by https://github.com/tzapu/WiFiManager but 
//- with more flexibility to add your own web server setup
//= state machine for changing wifi settings on the fly

#include <ESP8266WiFi.h>

#include "WiFiManager.h"

//create global object
WifiManager WiFiManager;

//function to call in setup
void WifiManager::begin(char const *apName)
{    
    captivePortalName = apName;

    WiFi.mode(WIFI_STA);

    if (WiFi.SSID() != "")
    {
        //trying to fix connection in progress hanging
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();
        WiFi.begin();
    }

    if (WiFi.waitForConnectResult() == WL_CONNECTED)
    {
        //connected
        Serial.println(PSTR("Connected to stored WiFi details"));
        Serial.println(WiFi.localIP());
    }
    else
    {
        //captive portal
        startCaptivePortal(captivePortalName);
    }
}

//function to forget current WiFi details and start a captive portal
void WifiManager::forget()
{ 
    WiFi.disconnect();
    startCaptivePortal(captivePortalName);
    Serial.println(PSTR("Requested to forget WiFi. Started Captive portal."));
}

//function to request a connection to new WiFi credentials
void WifiManager::setNewWifi(String newSSID, String newPass)
{    
    ssid = newSSID;
    pass = newPass;
    reconnect = true;
}

//function to connect to new WiFi credentials
void WifiManager::connectNewWifi(String newSSID, String newPass)
{
    delay(1000);

    //fix for auto connect racing issue
    if (!(WiFi.status() == WL_CONNECTED && (WiFi.SSID() == newSSID)))
    {          
        //trying to fix connection in progress hanging
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();

        //store old data in case new network is wrong
        String oldSSID = WiFi.SSID();
        String oldPSK = WiFi.psk();

        WiFi.begin(newSSID.c_str(), newPass.c_str(), 0, NULL, true);
        delay(2000);

        if (WiFi.waitForConnectResult() != WL_CONNECTED)
        {
            
            Serial.println(PSTR("New connection unsuccessful"));
            if (!inCaptivePortal)
            {
                WiFi.begin(oldSSID, oldPSK, 0, NULL, true);
                if (WiFi.waitForConnectResult() != WL_CONNECTED)
                {
                    Serial.println(PSTR("Reconnection failed too"));
                    startCaptivePortal(captivePortalName);
                }
                else 
                {
                    Serial.println(PSTR("Reconnection successful"));
                    Serial.println(WiFi.localIP());
                }
            }
        }
        else
        {
            if (inCaptivePortal)
            {
                stopCaptivePortal();
            }

            Serial.println(PSTR("New connection successful"));
            Serial.println(WiFi.localIP());
        }
    }
}

//function to start the captive portal
void WifiManager::startCaptivePortal(char const *apName)
{
    WiFi.persistent(false);
    // disconnect sta, start ap
    WiFi.disconnect(); //  this alone is not enough to stop the autoconnecter
    WiFi.mode(WIFI_AP);
    WiFi.persistent(true);

    WiFi.softAP(apName);

    dnsServer = new DNSServer();

    /* Setup the DNS server redirecting all the domains to the apIP */
    dnsServer->setErrorReplyCode(DNSReplyCode::NoError);
    dnsServer->start(53, "*", WiFi.softAPIP());

    Serial.println(PSTR("Opened a captive portal"));
    Serial.println(PSTR("192.168.4.1"));
    inCaptivePortal = true;
}

//function to stop the captive portal
void WifiManager::stopCaptivePortal()
{    
    WiFi.mode(WIFI_STA);
    delete dnsServer;

    inCaptivePortal = false;    
}

//return captive portal state
bool WifiManager::isCaptivePortal()
{
    return inCaptivePortal;
}

//return current SSID
String WifiManager::SSID()
{    
    return WiFi.SSID();
}

//captive portal loop
void WifiManager::loop()
{
    if (inCaptivePortal)
    {
        //captive portal loop
        dnsServer->processNextRequest();
    }

    if (reconnect)
    {
        connectNewWifi(ssid, pass);
        reconnect = false;
    }
    
}