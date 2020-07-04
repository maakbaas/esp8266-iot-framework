# Configuration Manager

For whatever function a device with an ESP8266 might have, it could be that you want the user to change some settings or parameters, such as the speed of a motor, or the color of a LED. The configuration manager provides a method to modify parameters from the browser which will be accessible from the software application. The parameters are generated from a JSON file. The configuration manager stores a struct with configuration data in the EEPROM. Structure can be changed at build time, data can be changed at runtime through the GUI which is also auto generated from the JSON.

Usage of this class is easy. See below how to define your configuration parameters. Once you have done this, these can be changed from the browser, and simply be called in the rest of your application as `configManager.data.parameterName`.

## Class Methods

#### begin

```c++
bool begin(int numBytes = 512);
```
This method must be called from the setup of the application. The optional argument will determine the flash size used for EEPROM. The method will attempt to restore the saved data from EEPROM. If no data is available, or if the fingerprint of the data structure has changed, the default values will be used.

#### saveRaw

```c++
void saveRaw(uint8_t test[]);
```
This method stores the input byte array into the EEPROM. This is an unsafe method, you must ensure externally that the input byte array is the correct length and structure.

#### reset

```c++
void reset();
```
This method resets the EEPROM contents to the default values.

## Class Members

#### data

```c++
configData data;
```
This member is the structure containing the RAM mirror of the configuration data.

## Note on partial updates

You might have noticed that the API only gives a function to update the full configuration data, but with a custom page in the web interface you can still update only some variables of the configuration data. In Javascript you then need to:

1. Read the binary data into an object with `bin2obj`
2. Modify the resulting object
3. Parse the modified object back to binary data with `obj2bin`.

On the low level then the full block will be rewritten. The reason for this implementation is that typically nothing is gained by writing individual members. The ESP8266 has no real EEPROM. The EEPROM class will rather write the content to a flash block. Since Flash memory can only be erased in blocks you have to wipe the whole lot and rewrite it. To prevent abusing the flash by potentially looping over a save function for individual members, this function is simply not available, enforcing you to only write the entire block at once.

## Updating from the C++ code

Of course you can also update configuration information from your code rather than through the web interface. To do this you need to make a RAM mirror of the `configManager.data` object. After you have modified the content of this object, you can simply give a pointer to its contents as an argument to the `configManager.saveRaw` function to store the result in EEPROM.

## Code Generation

As mentioned earlier, the configuration data is defined in the JSON file `html/js/configuration.json`. An example of how this file could look is shown here:

```json
[
    {
        "name": "projectName",
        "label": "Project Name",
        "type": "char",
        "length": 32,
        "value": "Generic ESP8266 Firmware"
    },
    {
        "name": "dummyInt",
        "type": "uint16_t",
        "value": 1000
    },
    {
        "name": "dummyBool",
        "type": "bool",
        "value": true
    },    
    {
        "name": "dummyFloat",
        "type": "float",
        "min": 1,
        "max": 10,
        "value": 1.2345
    },
    {
        "name": "dummyString",
        "type": "char",
        "hidden": true,
        "length": 11,
        "value": "invisible!"
    }
]
```

Supported data types are: bool, uint8_t, int8_t, uint16_t, int16_t, uint32_t, int32_t, float and char. The length argument is mandatory for datatype char to indicate the length of the string. Variable length strings are not supported. Also, arrays are not supported for now. For this example, the pre-build python script `preBuildConfig.py` will generate the following two files. These should be fairly self explanatory and show how the JSON file is translated into a C struct.

The `configVersion` is the CRC32 hash of the JSON file. This is added to the C code in order to detect if the JSON has changed compared to the content of the EEPROM, since the `configVersion` will also be stored in the EEPROM. This means that if a field is changed in the JSON, the application will know to reject the current content of the EEPROM since it might not be in accordance to the struct definitions it knows.

#### config.h
```c++
#ifndef CONFIG_H
#define CONFIG_H

struct configData
{
	char projectName[32];
	uint16_t dummyInt;
	bool dummyBool;
	float dummyFloat;
	char dummyString[11];
};

extern uint32_t configVersion;
extern const configData defaults;

#endif
```

#### config.c
```c++
#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 2773241707; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"Generic ESP8266 Firmware",
	1000,
	true,
	1.2345,
	"invisible!"
};
```

## Web interface

The page in the web interface that is connected to the Configuration manager is shown below. The javascript generating that page will read directly from the JSON and interact with the web server API to get the currently stored values and to request to store new values.

![](https://raw.githubusercontent.com/maakbaas/esp8266-iot-framework/master/docs/img/screenshot-config.png)

There are several configuration properties which will affect the UI of this page. None of these properties are validated server-side, they're only to adjust the web UI.

- `disabled`: will disable the control
- `hidden`: won't show an input control
- `length`: sets the input `maxlength` attribute (strings only)
- `min`/`max`/`step`: sets the corresponding input attributes (numbers only)
