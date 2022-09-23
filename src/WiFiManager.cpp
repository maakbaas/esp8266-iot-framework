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
#include "configManager.h"

//create global object
WifiManager WiFiManager;

//function to call in setup
void WifiManager::begin(char const *apName, unsigned long newTimeout, char const *hostName)
{
    captivePortalName = apName;
    timeout = newTimeout;
    
    if (hostName != NULL) {
        this->hostName = hostName;
    }

    WiFi.mode(WIFI_STA);
    WiFi.persistent(true);
    
    //set static IP if entered
    ip = IPAddress(configManager.internal.ip);
    gw = IPAddress(configManager.internal.gw);
    sub = IPAddress(configManager.internal.sub);
    dns = IPAddress(configManager.internal.dns);

    if (isIPAddressSet(ip) || isIPAddressSet(gw) || isIPAddressSet(sub) || isIPAddressSet(dns))
    {
        Serial.println(PSTR("Using static IP"));
        WiFi.config(ip, gw, sub, dns);
    }

#ifdef ESP32
    // ESP32 PITA: workaround configured persisted SSID not being restored to WiFi.SSID() 
    // See https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_wifi.html
    // See https://github.com/espressif/arduino-esp32/issues/548#
    wifi_config_t conf;
    esp_wifi_get_config(WIFI_IF_STA, &conf);
    String configSsid = F(conf.sta.ssid);
    String configPsk = F(conf.sta.password);

    Serial.println("configSsid=");
    Serial.println(configSsid);
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
            // NOTE: https://github.com/espressif/arduino-esp32/issues/2537
            WiFi.setHostname(hostName);
#elif defined(ESP8266)
            WiFi.hostname(hostName);
#endif
        }        
    }

    if (waitForConnectResult(timeout) == WL_CONNECTED)
    {
        //connected
        Serial.print(PSTR("Connected to stored WiFi details, hostName: "));
        Serial.print(hostName);
        Serial.print(PSTR(", localIP: "));
        Serial.println(WiFi.localIP());
    }
    else
    {
        //captive portal
        Serial.print(PSTR("Timed out waiting for connect. Starting captive portal. SSID: "));
        Serial.println(WiFi.SSID());
        startCaptivePortal(captivePortalName);
    }
}

//Upgraded default waitForConnectResult function to incorporate WL_NO_SSID_AVAIL, fixes issue #122
int8_t WifiManager::waitForConnectResult(unsigned long timeoutLengthMs) {
#ifdef ESP32
    // 1 (WIFI_MODE_STA) and 3 (WIFI_MODE_APSTA) have STA enabled
    if((WiFiGenericClass::getMode() & WIFI_MODE_STA) == 0) {
        Serial.print(PSTR("STA mode not enabled, returning WL_DISCONNECTED."));
        return WL_DISCONNECTED;
    }

    // Wait to become connected, or timeout expiration.  Bail if clock rollover detected.
    unsigned long now = millis();
    unsigned long start = now;
    unsigned long timeout = now + timeoutLengthMs;
    int loopCount = 0;
    while((now = millis()) < timeout && now >= start) {
        delay(1);
        wl_status_t wifiStatus = WiFi.status();
        if(wifiStatus != WL_DISCONNECTED &&     // Disconnected from a networ
            wifiStatus != WL_NO_SSID_AVAIL &&   // When no SSID are available
            wifiStatus != WL_IDLE_STATUS)       // Temporary status assigned when WiFi.begin() called
        {
            Serial.print(PSTR("WiFi.status()="));
            Serial.println(wifiStatus);
            return wifiStatus;
        }
        loopCount++;
    }

    Serial.print(PSTR("Loop count="));
    Serial.print(loopCount);

#elif defined(ESP8266)
    // 1 (WIFI_MODE_STA) and 3 (WIFI_MODE_APSTA) have STA enabled
    if((wifi_get_opmode() & 1) == 0) {
        return WL_DISCONNECTED;
    }
    using esp8266::polledTimeout::oneShot;
    oneShot timeout(timeoutLengthMs); // number of milliseconds to wait before returning timeout error
    while(!timeout) {
        yield();
        if(WiFi.status() != WL_DISCONNECTED && WiFi.status() != WL_NO_SSID_AVAIL) {
            return WiFi.status();
        }
    }
#endif

    return -1; // -1 indicates timeout
}

//function to forget current WiFi details and start a captive portal
void WifiManager::forget()
{ 
    WiFi.disconnect();
    startCaptivePortal(captivePortalName);

    //remove IP address from EEPROM
    ip = IPAddress();
    sub = IPAddress();
    gw = IPAddress();
    dns = IPAddress();

    //make EEPROM empty
    storeToEEPROM();

    if ( _forgetwificallback != NULL) {
        _forgetwificallback();
    } 

    Serial.println(PSTR("Requested to forget WiFi. Started Captive portal."));
}

//function to request a connection to new WiFi credentials
void WifiManager::setNewWifi(String newSSID, String newPass)
{    
    ssid = newSSID;
    pass = newPass;
    ip = IPAddress();
    sub = IPAddress();
    gw = IPAddress();
    dns = IPAddress();

    reconnect = true;
}

//function to request a connection to new WiFi credentials
void WifiManager::setNewWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns)
{
    ssid = newSSID;
    pass = newPass;
    ip.fromString(newIp);
    sub.fromString(newSub);
    gw.fromString(newGw);
    dns.fromString(newDns);

    reconnect = true;
}

//function to connect to new WiFi credentials
void WifiManager::connectNewWifi(String newSSID, String newPass)
{
    delay(1000);

    //set static IP or zeros if undefined    
    WiFi.config(ip, gw, sub, dns);

#ifdef ESP32        
    bool hasNetworkMismatch = 
        // operator uint32_t() const
        ip != configManager.internal.ip || 
        dns != configManager.internal.dns;
#elif defined(ESP8266)
    bool hasNetworkMismatch = 
        ip.v4() != configManager.internal.ip || 
        dns.v4() != configManager.internal.dns;
#endif

    //fix for auto connect racing issue
    if (!(WiFi.status() == WL_CONNECTED && (WiFi.SSID() == newSSID)) || hasNetworkMismatch)
    {          
        //trying to fix connection in progress hanging
#ifdef ESP32        
        WiFi.disconnect(false);
#elif defined(ESP8266)
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();
#endif

        //store old data in case new network is wrong
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

        // TODO:P0 Implement ESP32 version,
        // ESP32 doesn't have timeout param for WiFi.waitForConnectResult, times out after 10s, so either live with that or create wrapper...
#ifdef ESP32
        if (WiFi.waitForConnectResult() != WL_CONNECTED)
#elif defined(ESP8266)
        if (WiFi.waitForConnectResult(timeout) != WL_CONNECTED)
#endif            
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
                    NULL,            // BSSID / MAC of AP
                    true);           // connect

#ifdef ESP32
                if (WiFi.waitForConnectResult() != WL_CONNECTED)
#elif defined(ESP8266)
                if (WiFi.waitForConnectResult(timeout) != WL_CONNECTED)
#endif
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

            //store IP address in EEProm
            storeToEEPROM();

            if ( _newwificallback != NULL) {
                _newwificallback();
            }

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

    // TODO: Consider "4.3.2.1" or something else that's easier to remember...
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

void  WifiManager::forgetWiFiFunctionCallback( std::function<void()> func ) {
  _forgetwificallback = func;
}

void WifiManager::newWiFiFunctionCallback( std::function<void()> func ) {
  _newwificallback = func;
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

//return current Host Name
String WifiManager::getHostName()
{    
#ifdef ESP32
    return WiFi.getHostname();
#elif defined(ESP8266)
    return WiFi.hostname();
#endif            
}

//return current IP Address
String WifiManager::getIPAddress()
{    
    return WiFi.localIP().toString();
}

//return current MAC Address
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

//update IP address in EEPROM
void WifiManager::storeToEEPROM()
{
#ifdef ESP32
    configManager.internal.ip = ip;
    configManager.internal.gw = gw;
    configManager.internal.sub = sub;
    configManager.internal.dns = dns;
#elif defined(ESP8266)
    configManager.internal.ip = ip.v4();
    configManager.internal.gw = gw.v4();
    configManager.internal.sub = sub.v4();
    configManager.internal.dns = dns.v4();
#endif            
    configManager.save();
}

bool WifiManager::isIPAddressSet(IPAddress ip)
{
#if defined(ESP8266)
    return ip.isSet();
#else
    return ip.toString() == "0.0.0.0";
#endif
}
