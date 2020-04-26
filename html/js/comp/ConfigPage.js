import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Config from '../configuration.json';

import { Form, Button } from './UiComponents'


const Grey = styled.span`
    color:#666;
`;

export function ConfigPage(props) {
    const [state, setState] = useState([]);
    const [binSize, setBinSize] = useState(0);

    useEffect(() => {
        document.title = `Configuration`;
        fetchData();
    }, []);

    function fetchData() {
        fetch(props.API + '/api/config/get')
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                setBinSize(data.byteLength);
                bin2struct(data);
            });
    }

    var confItems;
    if (Config.length==0)
    {
        confItems=<p>There are no items defined in <b>configuration.json</b></p>
    }
    else
    {
        for (var i = 0; i < Config.length; i++) {
            var value; 
            if (typeof state[Config[i].name] !== 'undefined')
                value = state[Config[i].name];
            else
                value = '';
                
            var size;
            if (Config[i].type=='char')
                size = '[' + Config[i].length +']';
            else 
                size = '';

            confItems = <>{confItems}
                <p><label for={Config[i].name}><Grey>{Config[i].type}{size}</Grey>{" "}<b>{Config[i].name}</b>:</label>
                    <input type="text" id={Config[i].name} name={Config[i].name} value={value} />
                </p>
            </>
        }
    }

    var button;
    if (Object.keys(state).length>0)
        button = <Button onClick={() =>
            fetch(props.API + '/api/config/set', {
                method: 'post',
                body: form2bin()                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) 
                        fetchData();
            })         
        }>Save</Button>;

    var form = <><Form>
        {confItems}
    </Form>
    {button}        
    </>

    return <><h2>Configuration</h2><p>{form}</p></>;

    function form2bin()
    {
        const binData = new ArrayBuffer(binSize);
        const binDataView = new DataView(binData);
        var n = 0;

        for (var i = 0; i < Config.length; i++) 
        {  
            switch (Config[i].type) {
                case "char": 
                    var string = document.getElementById(Config[i].name).value;
                    for (var j=0; j<string.length; j++)
                    {
                        binDataView.setUint8(n, (new TextEncoder).encode(string[j])[0]);
                        n++;
                    }
                    binDataView.setUint8(n, 0);
                    n+=Config[i].length-string.length;
                    break;
                case "bool":
                    if (document.getElementById(Config[i].name).value=='true')                                            
                        binDataView.setUint8(n, 1);    
                    else
                        binDataView.setUint8(n, 0);                     
                    n++;
                    break;
                case "uint8_t":
                    binDataView.setUint8(n, Number(document.getElementById(Config[i].name).value));
                    n++;
                    break;
                case "int8_t":
                    binDataView.setInt8(n, Number(document.getElementById(Config[i].name).value));
                    n++;
                    break;
                case "uint16_t":
                    n = Math.ceil(n / 2) * 2; //padding
                    binDataView.setUint16(n, Number(document.getElementById(Config[i].name).value), true);
                    n+=2;
                    break;
                case "int16_t":
                    n = Math.ceil(n / 2) * 2; //padding
                    binDataView.setInt16(n, Number(document.getElementById(Config[i].name).value), true);
                    n+=2;
                    break;
                case "uint32_t":
                    n = Math.ceil(n / 4) * 4; //padding
                    binDataView.setUint32(n, Number(document.getElementById(Config[i].name).value), true);
                    n+=4;
                    break;
                case "int32_t":
                    n = Math.ceil(n / 4) * 4; //padding
                    binDataView.setInt32(n, Number(document.getElementById(Config[i].name).value), true);
                    n+=4;
                    break;
                case "float":
                    n = Math.ceil(n / 4) * 4; //padding
                    binDataView.setFloat32(n, Number(document.getElementById(Config[i].name).value), true);
                    n+=4;
                    break;                
            }            
        }

        return binData;

    }


    function bin2struct(rawData) {
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

        setState(parsedData);

    }
    
}