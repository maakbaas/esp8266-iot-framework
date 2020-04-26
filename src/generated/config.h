#ifndef CONFIG_H
#define CONFIG_H

struct configData
{
	char projectName[32];
	uint16_t dummyInt;
	bool dummyBool;
	float dummyFloat;
};

extern uint32_t configVersion;
extern const configData defaults;

#endif