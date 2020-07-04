#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 82270354; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"Generic ESP8266 Firmware",
	1000,
	true,
	1.2345
};