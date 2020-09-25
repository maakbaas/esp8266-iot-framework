# Getting Started

This section will describe how to use and modify the framework. There are two possible approaches to use the framework:

1. Use the framework as a PlatformIO library
2. Fork or clone this repository and start modifying.

If you don't know which of these two options you should choose, it is recommended to use the framework as a PlatformIO library. To get set up with either one of these options, please follow the [installation guide](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/installation-guide.md).

## Minimal main.c

In the minimum example `main.c` file below you can see the mandatory functions to call and files to include for the framework to function. The high level includes include each of the framework classes. In the `setup()` function the `.begin()` functions are called to get everything set up correctly.

In the `loop()` function a call must be made to the WiFi manager and the OTA update class. These are to trigger a call to certain functionality asynchronously.

Of course if you do not want to use certain parts of the framework you can remove these from `main.c`.

```c++
#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"
#include "configManager.h"
#include "timeSync.h"

void setup()
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
}

void loop()
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();
}
```

## Editing the Web Interface

The web interface is contained in the `HTML` folder, and is developed using React and Webpack. To modify the provided interface you need to be familiar with these tools and have [NPM](https://www.npmjs.com/get-npm) installed. Of course you can also start your own GUI completely from scratch. To get started:

1. Install NPM from the link above
2. Go to the command line in your project folder, and run the command `npm ci` to install all required JS packages for the web GUI. In case you use the framework through lib_deps the command should be run from the ESP8266 IoT Framework folder that is located within you .pio folder instead of the project root folder.

To start manually developing the web interface, you can run `npm run dev` to start a Webpack Dev Server. The API urls will be adjusted automatically when developing off the device. To get this working you will need to edit the IP address at the top of `html/js/index.js`.

```javascript
if (process.env.NODE_ENV === 'production')
    var url = window.location.origin;
else
    var url = 'http://192.168.1.54';
```
The command `npm run build` will generate a `html.h` file which contains the full bundle as a PROGMEM byte array to be included when building and flashing the framework to the ESP8266. But manual execution of this command is not needed if you use the `REBUILD_HTML` build flag.

If you have defined a custom location for the configuration JSON file, you need to build the ESP8266 sources at least once after changes in the JSON, so that it will be copied into the HTML folder. Otherwise the development server will not reflect the latest version of the JSON file.
