# WiFi Manager
The function of the WiFi manager is to help the user connect to a WiFi network. If no known network is found the ESP8266 will start a hotspot with a captive portal in which the network settings can be changed. WiFi information will be preserved in memory so that the ESP8266 will connect automatically in the future.

## Class Methods

#### begin

```c++
void begin(char const *apName, unsigned long newTimeout = 60000);
```
This method must be called from the setup of the application. The mandatory argument is the SSID name that will be used in case a captive portal is started. The optional timeout value allows you to set how long (in milliseconds) the stored WiFi connection will try for before returning to captive portal mode. The WiFi manager will connect to the stored WiFi details. If no details are stored, or if this fails, a captive portal will be started from 192.168.4.1.

#### loop

```c++
void loop();
```
This method must be called from the main loop of the application and allows to set and change the wifi details asynchronously from the web server call.

#### forget

```c++
void forget();
```
A call to this function will forget the stored WiFi details and start a captive portal.

#### isCaptivePortal

```c++
bool isCaptivePortal();
```
Returns true if a captive portal is currently active.
#### SSID()

```c++
String SSID();
```
Returns the SSID to which the ESP8266 is connected. Returns an empty string if a captive portal is running.

#### setNewWifi()

```c++
void setNewWifi(String newSSID, String newPass);
void setNewWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns);
```
Tries to connect to the WiFi network with SSID `newSSID` and password `newPass`. If this fails a reconnect to the known network will be attempted. If this also fails or if no previous network was known, a captive portal will be started. Alternatively the function can also be called with inputs for a static IP address if DHCP is not available.

#### forgetWiFiFunctionCallback() and newWiFiFunctionCallback

```c++
void forgetWiFiFunctionCallback( std::function<void()> func );
void newWiFiFunctionCallback( std::function<void()> func );
```
This functions is called at the end of forget WiFi or after new WiFi is configured. This would be helpful to execute your code after a WiFi configuration or after you delete a WiFi configuration from Devices

## Web interface

The page in the web interface that is connected to the WiFi settings is shown below. For now this is a simple page that:
* shows the currently connected network
* allows you to forget the current WiFi details
* allows you to set a new SSID and password.
* allows you to set a static IP address.

![](https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-wifi.png)
