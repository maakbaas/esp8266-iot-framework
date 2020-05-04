# File Manager

The file manager is part of the web interface and allows you to edit the contents of the SPIFFS file system. No class is implemented to support this. Instead the web server API interacts directly with the SPIFFS functions from the ESP8266 Arduino framework. 

Currently supported functionality is to download or delete files from the SPIFFS. Next to that, the interface will show used and available storage space.

![](https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-file.png)
