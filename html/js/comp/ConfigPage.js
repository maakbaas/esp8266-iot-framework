import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Config from '../configuration.json';

import { Form, Button } from './UiComponents'

import { obj2bin, bin2obj } from '../functions/configHelpers'

const Grey = styled.span`
    color:#666;
    font-size: 0.8em;
    white-space: nowrap;
`;

const DefaultTypeAttributes = {
    char: {
        type: "text",
    },
    bool: {
        type: "checkbox",
    },
    uint8_t: {
        type: "number",
        min: 0,
        max: 255,
        step: 1,
    },
    int8_t: {
        type: "number",
        min: -128,
        max: 127,
        step: 1,
    },
    uint16_t: {
        type: "number",
        min: 0,
        max: 65535,
        step: 1,
    },
    int16_t: {
        type: "number",
        min: -32768,
        max: 32767,
        step: 1,
    },
    uint32_t: "number",
    int32_t: {
        type: "number",
        min: -2147483648,
        max: 2147483647,
        step: 1,
    },
    float: {
        type: "number",
        min: -3.4028235E+38,
        max: 3.4028235E+38,
        step: "any",
    },
};

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
                setState(bin2obj(data));
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
            if (Config[i].hidden) {
                continue;
            }

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

            const configInputAttributes = DefaultTypeAttributes[Config[i].type] || {};
            const inputType = DefaultTypeAttributes[Config[i].type].type || "text";

            let conditionalAttributes = {};
            let rangeInfo;

            switch (inputType) {
                case "text":
                    conditionalAttributes.maxlength = Config[i].length;
                    break;

                case "checkbox":
                    conditionalAttributes.checked = value;
                    break;

                case "number":
                    conditionalAttributes.min = Config[i].min || configInputAttributes.min;
                    conditionalAttributes.max = Config[i].max || configInputAttributes.max;
                    conditionalAttributes.step = Config[i].step || configInputAttributes.step;

                    rangeInfo = <>
                        <Grey>({conditionalAttributes.min} &ndash; {conditionalAttributes.max})</Grey>
                    </>
                    break;
            }

            confItems = <>{confItems}
                <p>
                    <label for={Config[i].name}><b>{Config[i].label || Config[i].name}</b>: {rangeInfo}</label>
                    <input type={inputType} id={Config[i].name} name={Config[i].name} value={value} {...conditionalAttributes} disabled={Config[i].disabled} />
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
        var newData = {};

        for (var i = 0; i < Config.length; i++) {
            if (Config[i].hidden) {
                newData[Config[i].name] = state[Config[i].name];
                continue;
            }

            switch (Config[i].type) {
                case "bool":
                    newData[Config[i].name] = document.getElementById(Config[i].name).checked;
                    break;

                default:
                    newData[Config[i].name] = document.getElementById(Config[i].name).value;
            }
        }
        
        return obj2bin(newData, binSize);
        
    }
    
}