import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import Config from "../configuration.json";

import { Form, Button, StyledSlider } from "./UiComponents";

import { obj2bin, bin2obj } from "../functions/configHelpers";

// DEADCODE: import InputColor from 'react-input-color';
import Toggle from 'react-toggle';

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
        document.title = "Configuration";
        fetchData();
    }, []);

    function fetchData() {
        fetch(`${props.API}/api/config/get`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                setBinSize(data.byteLength);
                setState(bin2obj(data));
            });
    }

    let confItems;
    if (Config.length == 0) {
        confItems = <p>There are no items defined in <b>configuration.json</b></p>;
    } else {
        for (let i = 0; i < Config.length; i++) {
            if (Config[i].hidden) {
                continue;
            }

            let value; 
            if (typeof state[Config[i].name] !== "undefined") {value = state[Config[i].name];} else {value = "";}

            let inputControl = Config[i].inputControl || "input";

            const configInputAttributes = DefaultTypeAttributes[Config[i].type] || {};
            const inputType = DefaultTypeAttributes[Config[i].type].type || "text";

            const conditionalAttributes = {};
            let rangeInfo;

            switch (inputType) {
                case "text":
                    conditionalAttributes.maxlength = Config[i].length - 1;
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
                    </>;
                    break;
            }

            let inputControlElements;
            if (inputControl == "select") {
                inputControlElements = <><select id={Config[i].name} name={Config[i].name} value={value}>
                    {Config[i].options.map((currValue,index) => <option value={currValue}>{currValue}</option>)}
                </select></>;
            } else if (inputControl == "color") {
                // Using HTML <Input type=color.
                // - Considered alternative <InputColor from https://github.com/swiftcarrot/react-input-color
                //   but preferred browser in built color selector, is good enough.  Less dependencies.

                inputControlElements = <><input type="color" id={Config[i].name} name={Config[i].name} value={value} {...conditionalAttributes} disabled={Config[i].disabled} />
                    {/* DEADCODE: react-input-color:
                     <InputColor
                            initialValue={value}
                            id={Config[i].name}
                            name={Config[i].name}
                            placement="right"
                            onChange={(val) => state[Config[i].name] = val.hex}
                        /> */}
                    </>;
            } else if (inputControl == "slider") {
                // Using https://github.com/zillow/react-slider

                // Hide range info label, is redundant, since slider thumb displays selected value.
                rangeInfo = ""

                inputControlElements = <><StyledSlider
                        id={Config[i].name}
                        name={Config[i].name}
                        className="horizontal-slider"
                        thumbClassName="slider-thumb"
                        trackClassName="slider-track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        value={value}
                        {...conditionalAttributes}
                        onAfterChange={(val) => state[Config[i].name] = val}
                    /></>;
            } else if (inputControl == "toggle" || inputType == "checkbox") {
                // Using <Toggle> from https://github.com/aaronshaf/react-toggle
                // - Did consider <Switch> from https://github.com/clari/react-ios-switch 
                //   but preferred react-toggle since UI better matches react-slider.

                let isChecked = Boolean(value);
                    
                inputControlElements = <><Toggle
                    id={Config[i].name}
                    name={Config[i].name}
                    checked={state[Config[i].name]}
                    
                    icons={false}
                    onChange={(e) => { state[Config[i].name] = e.target.checked; this.setState(this.state);} } 
                    /></>;
            } else if (inputControl == "input") {
                inputControlElements = <input type={inputType} id={Config[i].name} name={Config[i].name} value={value} {...conditionalAttributes} disabled={Config[i].disabled} style="width:100%" />;
            } else {
                inputControlElements = <><div>Unknown inputControl type '{inputControl}'</div></>;
            }
            
            confItems = <>{confItems}
                <tr>
                    <td nowrap><label htmlFor={Config[i].name}><b>{Config[i].label || Config[i].name}</b>: {rangeInfo}</label></td>
                    <td>{inputControlElements}</td>
                </tr>
                </>;
        }
    }

    let button;
    if (Object.keys(state).length > 0) {
        button = <Button onClick={() =>
            fetch(`${props.API}/api/config/set`, {
                method: "post",
                body: form2bin(),                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {fetchData();}
                })         
        }>Save</Button>;
    }

    const form = <>
        <Form>
            <table width="100%" style="width:100%">
            {confItems}
            </table>
        </Form>
        {button}        
        </>;

    return <><h2>Configuration</h2><p>{form}</p></>;

    function form2bin() {
        const newData = {};

        for (let i = 0; i < Config.length; i++) {
            if (Config[i].hidden) {
                newData[Config[i].name] = state[Config[i].name];
                continue;
            }

            if (Config[i].type == "bool") {
                newData[Config[i].name] = document.getElementById(Config[i].name).checked;
            } else if (Config[i].inputControl == "color") {
                newData[Config[i].name] = document.getElementById(Config[i].name).value;
            } else if (Config[i].inputControl == "slider") {
                // Use state property that was modified when slider after change event fired
                newData[Config[i].name] = state[Config[i].name];
            }
            else {
                try
                {
                    newData[Config[i].name] = document.getElementById(Config[i].name).value;
                }
                catch (ex) {
                    alert("Ex, msg=" + ex.message + ", failed to find " + Config[i].name);
                }
            }
        }
        
        // DEBUG: alert(JSON.stringify(newData));
        return obj2bin(newData, binSize);
        
    }
    
}

ConfigPage.propTypes = {
    API: PropTypes.string,
};
