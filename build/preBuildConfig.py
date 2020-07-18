import json
import binascii

filename = "config"
h = open("../src/generated/" + filename + ".h", "w", encoding="utf8")
cpp = open("../src/generated/" + filename + ".cpp", "w", encoding="utf8")

with open('../html/js/configuration.json') as f:
  data = json.load(f)

# binascii.crc32(mes.encode('utf8'))
#headers
h.write("#ifndef CONFIG_H\n")
h.write("#define CONFIG_H\n\n")
h.write("struct configData\n{\n")

cpp.write("#include <Arduino.h>\n")
cpp.write("#include \"config.h\"\n\n")

cpp.write("uint32_t configVersion = " + str(binascii.crc32(json.dumps(data).encode())) + "; //generated identifier to compare config with EEPROM\n\n")

cpp.write("const configData defaults PROGMEM =\n{\n")

#loop through variables
first = True
for item in data: 
    
    if first==True:
        first=False
    else:
        cpp.write(',\n')

    if item['type'] == 'char':
        cpp.write("\t\"" + item['value'] + "\"")
        h.write("\tchar " + item['name'] + "[" + str(item['length']) + "];\n")
    elif item['type'] == 'bool':
        cpp.write("\t" + str(item['value']).lower())
        h.write("\t" + item['type'] + " " + item['name'] +";\n")
    else:
        cpp.write("\t" + str(item['value']))
        h.write("\t" + item['type'] + " " + item['name'] +";\n")

#footers
h.write("};\n\nextern uint32_t configVersion;\n")
h.write("extern const configData defaults;\n\n")
h.write("#endif")

cpp.write("\n};")

h.close()
cpp.close()