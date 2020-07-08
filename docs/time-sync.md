# NTP Time Sync
Certificates are only valid for a specific time period; therefore, in order to determine whether a certificate is valid, the ESP8266 must be set to the current date and time. This is usually accomplished using the SNTP protocol to get the current time from a NTP server. This class provides methods to help sync with a NTP server and to verify that the time has been synced.

## Class Methods

#### begin

```c++
void begin();
void begin(const char* tz);
void begin(const char* tz, const char* server1, const char* server2 = nullptr, const char* server3 = nullptr);
```
This method must be called from the setup of the application and will setup the server time needed for SSL connections and potentially useful for other parts of the application. When called without parameters the timezone is set to UTC. A list of timezone values can be found in [TZ.h](https://raw.githubusercontent.com/esp8266/Arduino/master/cores/esp8266/TZ.h). When called without specifying NTP servers 0.pool.ntp.org, 1.pool.ntp.org and 2.pool.ntp.org are used.

This method is non-blocking. After being invoked the methods below can be used to verify the ESP8266's time has been set. This should be done prior to any HTTPS requests being made.


#### isSynced

```c++
bool isSynced();
```
This method returns true if the time has been set and false if it has not.

#### getStatus 

```c++
int8_t waitForSyncResult(unsigned long timeoutLength = 10000);
```
This method will block until the time has been set or until it times out. If it times out -1 will be returned. The timeout is in milliseconds and by default is 10 seconds.
