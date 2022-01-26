#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 3764343299; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"Haptic-01",
	"Haptic Light ESP8266",
	"Aurora",
	50,
	20,
	true,
	true,
	"#ff00ff",
	23,
	50,
	true,
	60,
	true,
	false,
	30,
	1.2345,
	"invisible!"
};