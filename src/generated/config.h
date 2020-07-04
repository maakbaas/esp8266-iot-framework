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