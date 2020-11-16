export function obj2bin(obj, binSize, JSON) {
    const binData = new ArrayBuffer(binSize);
    const binDataView = new DataView(binData);
    let n = 0;

    for (let i = 0; i < JSON.length; i++) {
        switch (JSON[i].type) {
            case "char":
                for (let j = 0; j < obj[JSON[i].name].length; j++) {
                    binDataView.setUint8(n, (new TextEncoder).encode(obj[JSON[i].name][j])[0]);
                    n++;
                }
                binDataView.setUint8(n, 0);
                n += JSON[i].length - obj[JSON[i].name].length;
                break;
            case "bool":
                if (obj[JSON[i].name] === true) {binDataView.setUint8(n, 1);} else {binDataView.setUint8(n, 0);}
                n++;
                break;
            case "uint8_t":
                binDataView.setUint8(n, Number(obj[JSON[i].name]));
                n++;
                break;
            case "int8_t":
                binDataView.setInt8(n, Number(obj[JSON[i].name]));
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setUint16(n, Number(obj[JSON[i].name]), true);
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setInt16(n, Number(obj[JSON[i].name]), true);
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setUint32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setInt32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setFloat32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
        }
    }

    return binData;

}

export function bin2obj(rawData, JSON) {
    const utf8decoder = new TextDecoder();

    const parsedData = {};
    const rawDataView = new DataView(rawData);
    
    let n = 0;
    for (let i = 0; i < JSON.length; i++) {        
        switch (JSON[i].type) {
            case "char":
                parsedData[JSON[i].name] = utf8decoder.decode(rawData.slice(n, n + JSON[i].length)).split("\0").shift();
                n = n + JSON[i].length;
                break;
            case "bool":
                parsedData[JSON[i].name] = !!rawDataView.getUint8(n);
                n++;
                break;
            case "uint8_t":
                parsedData[JSON[i].name] = (rawDataView.getUint8(n)).toString();
                n++;
                break;
            case "int8_t":
                parsedData[JSON[i].name] = (rawDataView.getInt8(n)).toString();
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[JSON[i].name] = (rawDataView.getUint16(n, true)).toString();
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[JSON[i].name] = (rawDataView.getInt16(n, true)).toString();
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getUint32(n, true)).toString();
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getInt32(n, true)).toString();
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getFloat32(n, true)).toString();
                n += 4;
                break;
        }
    }
    
    return (parsedData);

}

export function sizes(JSON) {

    const sizeArray = [];
    let n = 0;
    for (let i = 0; i < JSON.length; i++) {
        switch (JSON[i].type) {
            case "char":
                sizeArray[i] = [n, JSON[i].length];                
                n = n + JSON[i].length;
                break;
            case "bool":
                sizeArray[i] = [n, 1];                
                n++;
                break;
            case "uint8_t":
                sizeArray[i] = [n, 1];                
                n++;
                break;
            case "int8_t":
                sizeArray[i] = [n, 1];                
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                sizeArray[i] = [n, 2];                
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                sizeArray[i] = [n, 2];                
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray[i] = [n, 4];                
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray[i] = [n, 4];                
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray[i] = [n, 4];                
                n += 4;
                break;
        }
    }

    return (sizeArray);

}