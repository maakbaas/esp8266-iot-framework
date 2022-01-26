#ifndef CONFIG_H
#define CONFIG_H

struct configData
{
	char hostName[32];
	char projectName[32];
	char mode[20];
	uint8_t brightness;
	uint8_t nightBrightness;
	bool isActive;
	bool isPlaying;
	char color[11];
	uint8_t speed;
	uint8_t audioLevel;
	bool isPirSensorEnabled;
	uint16_t pirActiveTimeoutSecs;
	bool isLuxSensorEnabled;
	bool isTempSensorEnabled;
	uint16_t pixelCount;
	float dummyFloat;
	char dummyString[11];
};

extern uint32_t configVersion;
extern const configData defaults;

#endif