# OTA Updates
Finally the framework provides a function to update the firmware on the ESP8266 from the browser. The firmware can be uploaded through the Browser to SPIFFS and then flashed to the device.

## Class Methods

#### loop

```c++
void loop();
```
This method must be called from the main loop of the application and allows to update the firmware asynchronously from the web server call.

#### requestStart

```c++
void requestStart(String filename);
```
A call to this function will attempt to start the firmware update process to the SPIFFS file `filename`. 

#### getStatus 

```c++
uint8_t getStatus();
```
getStatus returns one of four possible values:
* 255: No update has been requested
* 254: An update is ongoing
* 0: The update has failed
* 1: The update is successful

## Web interface

To make updating the firmware easy, a wizard has been implemented in the web interface to guide you through the process. The wizard contains of three steps:
1. Upload or select the firmware file to flash
2. Update the firmware using the class described in this section
3. Reboot the ESP8266 to finalize the process and boot from the new firmware

![](https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-firmware.png)
