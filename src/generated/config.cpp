#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 327553685; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"ESP8266 IoT Framework",
	1000,
	true,
	1.2345,
	"invisible!"
};