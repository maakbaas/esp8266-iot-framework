# HTTPS Requests
Fetching or posting data to the internet is one of the core tasks of an IoT device. Doing so over HTTP is implemented quite well in the default ESP8266 Arduino libraries, but for HTTPS requests things are less straightforward. This class implements arbitrary HTTPS requests in a secure way, without requiring any specific certificates or fingerprints to be hard coded in the application. A full certificate store is automatically downloaded on build, and stored in PROGMEM.

## Class Methods

#### begin

```c++
int begin();
int begin(const char* tz);
int begin(const char* tz, const char* server1, const char* server2 = nullptr, const char* server3 = nullptr);
```
This method must be called from the setup of the application and will setup the server time needed for SSL connections and potentially useful for other parts of the application. When called without parameters the timezone is set to UTC. A list of timezone values can be found in [TZ.h](https://raw.githubusercontent.com/esp8266/Arduino/master/cores/esp8266/TZ.h). When called without specifying NTP servers 0.pool.ntp.org, 1.pool.ntp.org and 2.pool.ntp.org are used. If the time has not been set within 10s the attempt will timeout and -1 will be returned.

#### GET

```c++
int GET(String url);
```
This method starts a GET request to the URL specified in `url`. The URL must include a http:// or https:// prefix. The method returns the HTTP response code.

#### POST

```c++
int POST(String url, String body);
```
This method starts a POST request to the URL specified in `url` with the payload specified in `body`. The URL must include a http:// or https:// prefix. The method returns the HTTP response code.

#### busy

```c++
bool busy();
```
This method returns if the server is still connected or if new bytes are still available to be read.

#### available

```c++
bool available();
```
This method returns if there are still bytes available to read. In general the `busy()` function is more robust to use in a while loop if you want to stream incoming data.

#### read

```c++
uint8_t read();
```
Returns the next byte from the incoming response to the HTTP(S) request.

#### readString

```c++
String readString();
```
Reads the complete response as a string. Use this method only if you are requesting an API or other URL for which you know that the response only contains a limited number of bytes.

#### clean

```c++
void clean();
```
Call this after you have finished handling a request to free up the memory that was used by the `http` and `client` objects.

## Usage Examples

For parsing and processing larger responses you can stream the incoming data such as in this example:

```c++
fetch.GET("https://www.google.com");

while (fetch.busy())
{
    if (fetch.available())
    {
        Serial.write(fetch.read());
    }
}

fetch.clean();
```

For reading in a shorter response you can simply use `readString()` instead:

```c++
fetch.GET("https://www.google.com");

Serial.write(fetch.readString());

fetch.clean();
```

## Code Generation

As mentioned earlier a full certificate store is saved in PROGMEM as part of the application. By default this store is located in `certificates.h`, and will be included in the build. These certificates will be used by the ESP8266 Arduino BearSSL class to establish a secure connection.

If you ever want to update or rebuild the certificate store, you can do this by enabling or running the pre-build script `preBuildCertificates.py`. This script will read in all root certificates from the Mozilla certificate store and process these into a format that is compatible with the ESP8266 Arduino layer.

For this step OpenSSL is needed. On Linux this is probably available by default, on Windows this comes as part of something like MinGW, or Cygwin, but is also installed with the Windows Git client. If needed you can edit the path to OpenSSL at the top of the `preBuildCertificates.py` file:

```c++
#path to openssl
openssl = "C:\\msys32\\usr\\bin\\openssl"
```
