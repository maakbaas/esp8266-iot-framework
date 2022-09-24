#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 3113778868; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"ESP8266 IoT Framework",
	"en"
};