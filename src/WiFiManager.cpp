//inspired by https://github.com/tzapu/WiFiManager but 
//- with more flexibility to add your own web server setup
//= state machine for changing wifi settings on the fly


#ifdef ESP32
#include <WiFi.h>
#include <esp_wifi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif


#include "WiFiManager.h"

//create global object
WifiManager WiFiManager;

//function to call in setup
void WifiManager::begin(
    char const *apName,
    char const *hostName)
{    
    captivePortalName = apName;

    if (hostName != NULL) {
        this->hostName = hostName;
    }
    

    WiFi.mode(WIFI_STA);

#ifdef ESP32
    // ESP32 PITA: workaround configured persisted SSID not being restored to WiFi.SSID() 
    // See https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_wifi.html
    // See https://github.com/espressif/arduino-esp32/issues/548#
    wifi_config_t conf;
    esp_wifi_get_config(WIFI_IF_STA, &conf);
    String configSsid = F(conf.sta.ssid);
    String configPsk = F(conf.sta.password);
    // if (WiFi.SSID() != configSsid)
    // {
    //     WiFi.SSID = configSsid
    // }
#elif defined(ESP8266)
    String configSsid = WiFi.SSID();
#endif

    if (configSsid == "")
    {
        Serial.println(PSTR("Configured SSID is empty."));
    }
    else
    {
#ifdef ESP32        
        WiFi.disconnect(false);
#elif defined(ESP8266)
        //trying to fix connection in progress hanging
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();
#endif

        if (hostName != NULL && strlen(hostName) > 0) {
#ifdef ESP32
            WiFi.setHostname(hostName);
#elif defined(ESP8266)
            WiFi.hostname(hostName);
#endif
        }

        Serial.print(PSTR("WiFi.begin(), WifiManager::begin(), SSID: "));
        Serial.print(configSsid);
        Serial.print(PSTR(", hostName: "));
        Serial.println(hostName);

        WiFi.begin();

        if (hostName != NULL && strlen(hostName) > 0) {
#ifdef ESP32
            // https://github.com/espressif/arduino-esp32/issues/2537
            // esp_err_t ret = tcpip_adapter_set_hostname(TCPIP_ADAPTER_IF_STA ,"ESP32-LIGHT");
            // if(ret != ESP_OK ){
            //     Serial.print("failed to set hostname, ret:");  
            //     Serial.print(ret);
            // }
            WiFi.setHostname(hostName);
#elif defined(ESP8266)
            WiFi.hostname(hostName);
#endif
        }        
    }

    if (WiFi.waitForConnectResult() == WL_CONNECTED)
    {
        //connected
        Serial.print(PSTR("Connected to stored WiFi details, hostName: "));
        Serial.print(hostName);
        Serial.print(PSTR(", localIP: "));
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.print(PSTR("Timed out waiting for connect. Starting captive portal. SSID: "));
        Serial.println(WiFi.SSID());
        startCaptivePortal(captivePortalName);
    }
}

//function to forget current WiFi details and start a captive portal
void WifiManager::forget()
{ 
    Serial.println(PSTR("Requested to forget WiFi. Disconnecting and starting captive portal."));
    WiFi.disconnect();
    startCaptivePortal(captivePortalName);
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
    Serial.println("WifiManager::connectNewWifi");
    delay(1000);

    //fix for auto connect racing issue
    if (!(WiFi.status() == WL_CONNECTED && (WiFi.SSID() == newSSID)))
    {          
        //trying to fix connection in progress hanging
#ifdef ESP32        
        WiFi.disconnect(false);
#elif defined(ESP8266)
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();
#endif

        // store old data in case new network is wrong
#ifdef ESP32        
        // ESP32 PITA workaround configured persisted SSID not being restored to WiFi.SSID() 
        wifi_config_t conf;
        esp_wifi_get_config(WIFI_IF_STA, &conf);
        String oldSSID = F(conf.sta.ssid);
        String oldPSK = F(conf.sta.password);
#elif defined(ESP8266)
        String oldSSID = WiFi.SSID();
        String oldPSK = WiFi.psk();
#endif

        if (hostName != NULL && strlen(hostName) > 0) {
#ifdef ESP32
            WiFi.setHostname(hostName);
#elif defined(ESP8266)
            WiFi.hostname(hostName);
#endif            
        }

        Serial.print(PSTR("WiFi.begin, connectNewWifi, hostName: "));
        Serial.print(hostName);
#if defined(ESP8266)
        Serial.print(", persistent: ");
        Serial.print(WiFi.getPersistent());
#endif
        Serial.print(", SSID: ");
        Serial.println(newSSID.c_str());
        
        WiFi.begin(newSSID.c_str(), newPass.c_str(), 0, NULL, true);
        delay(2000);

        if (WiFi.waitForConnectResult() != WL_CONNECTED)
        {
            Serial.println(PSTR("New connection unsuccessful"));
            if (!inCaptivePortal)
            {
                Serial.print(PSTR("WiFi.begin, !inCaptivePortal, hostName: "));
                Serial.println(hostName);

                WiFi.begin(
                    oldSSID.c_str(), // ssid
                    oldPSK.c_str(),  // passphrase
                    0,               // channel
                    NULL,            // bssid
                    true);           // connect

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

String WifiManager::getHostName()
{    
#ifdef ESP32
    return WiFi.getHostname();
#elif defined(ESP8266)
    return WiFi.hostname();
#endif            
}

String WifiManager::getIPAddress()
{    
    return WiFi.localIP().toString();
}

String WifiManager::getMacAddress()
{    
    return WiFi.macAddress();
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