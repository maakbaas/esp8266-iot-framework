import Config from '../configuration.json';

export function obj2bin(obj, binSize) {
    const binData = new ArrayBuffer(binSize);
    const binDataView = new DataView(binData);
    var n = 0;

    for (var i = 0; i < Config.length; i++) {
        switch (Config[i].type) {
            case "char":
                for (var j = 0; j < obj[Config[i].name].length; j++) {
                    binDataView.setUint8(n, (new TextEncoder).encode(obj[Config[i].name][j])[0]);
                    n++;
                }
                binDataView.setUint8(n, 0);
                n += Config[i].length - obj[Config[i].name].length;
                break;
            case "bool":
                if (obj[Config[i].name] == 'true')
                    binDataView.setUint8(n, 1);
                else
                    binDataView.setUint8(n, 0);
                n++;
                break;
            case "uint8_t":
                binDataView.setUint8(n, Number(obj[Config[i].name]));
                n++;
                break;
            case "int8_t":
                binDataView.setInt8(n, Number(obj[Config[i].name]));
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setUint16(n, Number(obj[Config[i].name]), true);
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setInt16(n, Number(obj[Config[i].name]), true);
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setUint32(n, Number(obj[Config[i].name]), true);
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setInt32(n, Number(obj[Config[i].name]), true);
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setFloat32(n, Number(obj[Config[i].name]), true);
                n += 4;
                break;
        }
    }

    return binData;

}


export function bin2obj(rawData) {
    let utf8decoder = new TextDecoder();

    var parsedData = {};
    const rawDataView = new DataView(rawData);

    var n = 0;
    for (var i = 0; i < Config.length; i++) {
        switch (Config[i].type) {
            case "char":
                parsedData[Config[i].name] = utf8decoder.decode(rawData.slice(n, n + Config[i].length)).split("\0").shift();
                n = n + Config[i].length;
                break;
            case "bool":
                parsedData[Config[i].name] = Boolean(rawDataView.getUint8(n)).toString();
                n++;
                break;
            case "uint8_t":
                parsedData[Config[i].name] = (rawDataView.getUint8(n)).toString();
                n++;
                break;
            case "int8_t":
                parsedData[Config[i].name] = (rawDataView.getInt8(n)).toString();
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[Config[i].name] = (rawDataView.getUint16(n, true)).toString();
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[Config[i].name] = (rawDataView.getInt16(n, true)).toString();
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[Config[i].name] = (rawDataView.getUint32(n, true)).toString();
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[Config[i].name] = (rawDataView.getInt32(n, true)).toString();
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[Config[i].name] = (rawDataView.getFloat32(n, true)).toString();
                n += 4;
                break;


        }
    }

    return(parsedData);

}