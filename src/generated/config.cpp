#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 3385735415; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"ESP8266 IoT Framework",
	1000,
	true,
	1.2345,
	"invisible!"
};