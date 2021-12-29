import React, {useState, useEffect} from "react";

import styled from "styled-components";

import { ControlItem } from "./ControlItem";
import { DisplayItem } from "./DisplayItem";

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

const Grey = styled.span`
    color:#666;
    white-space: nowrap;
`;

const Display = styled.p`
    span, & > div {
        border-radius:3px;
        padding:0.3em;
        display:inline-block;
        border:1px solid #c0d1de;
        background-color:#edf3fc;
    }
    span.false {
        border:1px solid #ff3333;
        background-color:#ffb3b3;
    }
    span.true {
        border:1px solid #c4e052;
        background-color:#e6f9b8;
    }

    & > div {
        width:437px;
        max-width:calc(100% - 0.6em);
    }

    label {
        vertical-align:top;
    }
`;

const Control = styled.p`
    input[type=number],    
    input[type=text] {
        margin-right:0.3em;
        width:410px;
        max-width:calc(100% - 40px);
    }

    button {        
        padding:0.4em 0.5em;
    }
`;

const DefaultTypeAttributes = {
    char: {
        type: "text",
    },
    color: {
        type: "color",
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

export function DashboardItems(props) {

    const [data, setData] = useState([]);
    
    //populate graphs
    useEffect(() => {   
        if (props.data.length > 0 && typeof props.data[0][1] !== "undefined") {
            //contains historical data
            setData(props.data[props.data.length - 1][1]);
        } else {
            setData(props.data);
        }        
    });

    let confItems;
    if (props.items.length == 0) {
        confItems = <p>{loc.dashEmpty}</p>;
    } else {
        for (let i = 0; i < props.items.length; i++) {
            if (props.items[i].hidden) {
                continue;
            }

            let value;
            if (typeof data !== "undefined" && typeof data[props.items[i].name] !== "undefined") { 
                value = data[props.items[i].name]; 

                //number of digits
                if (props.items[i].type == "float" && typeof props.items[i].digits !== "undefined") {
                    value = parseFloat(value).toFixed(props.items[i].digits);
                }
                
            } else { value = ""; }

            const configInputAttributes = DefaultTypeAttributes[props.items[i].type] || {};
            let inputType;
            if (typeof props.items[i].control !== "undefined") {
                inputType = props.items[i].control;
            } else {
                inputType = DefaultTypeAttributes[props.items[i].type].type || "text";
            }

            const conditionalAttributes = {};
            let rangeInfo;

            switch (inputType) {
                case "text":
                    conditionalAttributes.maxlength = props.items[i].length - 1;
                    break;

                case "checkbox":
                    conditionalAttributes.checked = value;
                    break;

                case "number":
                    conditionalAttributes.min = props.items[i].min; // || configInputAttributes.min;
                    conditionalAttributes.max = props.items[i].max; // || configInputAttributes.max;
                    conditionalAttributes.step = props.items[i].step; // || configInputAttributes.step;

                    if (typeof conditionalAttributes.min !== "undefined") {
                        rangeInfo = <>
                            <Grey>({conditionalAttributes.min} &ndash; {conditionalAttributes.max})</Grey>
                        </>;
                    }
                    break;

                case "slider":
                    conditionalAttributes.min = props.items[i].min || configInputAttributes.min;
                    conditionalAttributes.max = props.items[i].max || configInputAttributes.max;
                    conditionalAttributes.step = props.items[i].step || configInputAttributes.step;                   
                    break;

                case "select":
                    conditionalAttributes.options = props.items[i].options;                                        
                    conditionalAttributes.optionLabels = props.items[i].options;
                    if (typeof props.items[i].optionLabels !== "undefined") {
                        conditionalAttributes.optionLabels = props.items[i].optionLabels;
                    }
                    break;
            }

            const direction = props.items[i].direction || "config";
            
            switch (direction) {
                case "display":                    
                    confItems = <>{confItems}
                        <Display>
                            <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                            <DisplayItem 
                                item={props.items[i]} 
                                data={props.data}
                                value={value} />
                        </Display>
                    </>;
                    
                    break;

                case "control":                     
                    confItems = <>{confItems}
                        <Control>
                            <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                            <ControlItem 
                                API={props.API} 
                                dataType={props.items[i].type} 
                                type={inputType} 
                                name={props.items[i].name} 
                                value={value} 
                                conditionalAttributes={conditionalAttributes} 
                            />                            
                        </Control>
                    </>;
                    break;

                case "config":
                    if (inputType == "select") {
                        let options;
                        for (let i = 0; i < conditionalAttributes.options.length; i++) {  
                            let label = conditionalAttributes.options[i];
                            if (typeof conditionalAttributes.optionLabels[i] !== "undefined") {
                                label = conditionalAttributes.optionLabels[i];
                            }
                            options = <>{options}<option value={conditionalAttributes.options[i]}>{label}</option></>;            
                        }
                        confItems = <>{confItems}
                            <p>
                                <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                                <select id={props.items[i].name} name={props.items[i].name} value={value} disabled={props.items[i].disabled}>
                                    {options}
                                </select>
                            </p>
                        </>;
                    } else if (inputType == "slider") {
                        
                        const [rangeval, setRangeval] = useState(null);
                        
                        confItems = <>{confItems}
                            <p>
                                <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>:</label>
                                <input type="range" id={props.items[i].name} name={props.items[i].name} value={rangeval || value} {...conditionalAttributes} disabled={props.items[i].disabled} onInput={(event) => setRangeval(event.target.value)} />
                                <output>{rangeval || value}</output>
                            </p>
                        </>;
                    } else {
                        confItems = <>{confItems}
                            <p>
                                <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                                <input type={inputType} id={props.items[i].name} name={props.items[i].name} value={value} {...conditionalAttributes} disabled={props.items[i].disabled} />
                            </p>
                        </>;
                    }
                    break;
                    
            }
            
        }
    }

    return confItems;

}