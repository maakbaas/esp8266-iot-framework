#ifndef CONFIG_H
#define CONFIG_H

struct configData
{
	char projectName[32];
};

extern uint32_t configVersion;
extern const configData defaults;

#endif