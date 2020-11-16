import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import { Button } from "./UiComponents";
import { Upload } from "react-feather";

import Dash from "../dashboard.json";
import { sizes } from "./../functions/configHelpers";

import "../../../node_modules/react-vis/dist/style.css";
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries } from "react-vis";

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

export function Dashboard(props) {

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

    const sizesArray = sizes(Dash);

    let confItems;
    if (props.items.length == 0) {
        confItems = <p>There are no items defined in <b>configuration.json</b></p>;
    } else {
        for (let i = 0; i < props.items.length; i++) {
            if (props.items[i].hidden) {
                continue;
            }

            let value;
            if (typeof data !== "undefined" && typeof data[props.items[i].name] !== "undefined") { value = data[props.items[i].name]; } else { value = ""; }

            //const configInputAttributes = DefaultTypeAttributes[props.items[i].type] || {};
            const inputType = DefaultTypeAttributes[props.items[i].type].type || "text";

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
            }

            const direction = props.items[i].direction || "config";
            
            switch (direction) {
                case "display":
                    if (props.items[i].display == "graph") {     
                        const chartData = [];
                        let min;
                        let max;
                        let xLim = [0, 1];
                        if (props.data.length > 0) {
                            min = props.data[0][1][props.items[i].name];
                            max = props.data[0][1][props.items[i].name];

                            xLim = [props.data[props.data.length - 1][0] - (props.items[i].xaxis || 10) * 1000 + 500, props.data[props.data.length - 1][0] - 500];
                        }
                        for (let j = 0; j < props.data.length; j++) {
                            if (props.data[j][0] > props.data[props.data.length - 1][0] - (props.items[i].xaxis || 10) * 1000 + 500) {
                                chartData.push({ x: props.data[j][0], y: props.data[j][1][props.items[i].name]});
                                min = Math.min(min, props.data[j][1][props.items[i].name]);
                                max = Math.max(max, props.data[j][1][props.items[i].name]);
                            }
                        }                
                        confItems = <>{confItems}
                            <Display>
                                <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>                                                              
                                <div>
                                    <FlexibleWidthXYPlot    
                                        xDomain={xLim}
                                        margin={{ left: 40, right: 10, top: 10, bottom: 10 }}
                                        xType='time'
                                        yDomain={[min - 0.1 * (max - min), max + 0.1 * (max - min)]}
                                        yBaseValue={min - 0.1 * (max - min)}
                                        height={150}>
                                        <HorizontalGridLines />
                                        <VerticalGridLines />                                        
                                        <XAxis 
                                            tickValues={[]} />
                                        <YAxis 
                                            tickSizeInner={0} />
                                        <LineSeries
                                            color="#000"
                                            data={chartData} />
                                    </FlexibleWidthXYPlot>                              
                                </div>
                            </Display>
                        </>;
                            
                    } else {
                        confItems = <>{confItems}
                            <Display>
                                <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                                <span id={props.items[i].name} name={props.items[i].name} className={props.items[i].type == "bool" ? value.toString() : ""}>{value.toString()}</span>
                            </Display>
                        </>;
                    }
                    break;

                case "control":                     
                    confItems = <>{confItems}
                        <Control>
                            <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                            <ControlInput API={props.API} dataType={props.items[i].type} sizes={sizesArray[i]} type={inputType} id={props.items[i].name} name={props.items[i].name} value={value} conditionalAttributes={conditionalAttributes} />                            
                        </Control>
                    </>;
                    break;

                case "config":
                    confItems = <>{confItems}
                        <p>
                            <label htmlFor={props.items[i].name}><b>{props.items[i].label || props.items[i].name}</b>: {rangeInfo}</label>
                            <input type={inputType} id={props.items[i].name} name={props.items[i].name} value={value} {...conditionalAttributes} disabled={props.items[i].disabled} />
                        </p>
                    </>;
                    break;
                    
            }
            
        }
    }

    return confItems;

}

function ControlInput(props) {

    const [data, setData] = useState([]);
    const [target, setTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    //populate graphs
    useEffect(() => {
        if (target != null) {
            setData(target);                  
        } else {
            setData(props.value);                  
        }

        if (saved && props.value == target) {
            setSaving(0);
            setSaved(0);
            setTarget(null);
        }

        if (saving && target != null) {
            const binData = new ArrayBuffer(props.sizes[1]);
            const binDataView = new DataView(binData);
            switch (props.dataType) {
                case "char":
                    for (let j = 0; j < target.length; j++) {
                        binDataView.setUint8(j, (new TextEncoder).encode(target[j])[0]);
                    }
                    binDataView.setUint8(target.length, 0);
                    break;
                case "bool":
                    if (target === true) { binDataView.setUint8(0, 1); } else { binDataView.setUint8(0, 0); }
                    break;
                case "uint8_t":
                    binDataView.setUint8(0, Number(target));
                    break;
                case "int8_t":
                    binDataView.setInt8(0, Number(target));
                    break;
                case "uint16_t":
                    binDataView.setUint16(0, Number(target), true);
                    break;
                case "int16_t":
                    binDataView.setInt16(0, Number(target), true);
                    break;
                case "uint32_t":
                    binDataView.setUint32(0, Number(target), true);
                    break;
                case "int32_t":
                    binDataView.setInt32(0, Number(target), true);
                    break;
                case "float":
                    binDataView.setFloat32(0, Number(target), true);
                    break;
            }
            fetch(`${props.API}/api/dash/set?start=${props.sizes[0]}&length=${props.sizes[1]}`, {
                method: "post",
                body: binData,
            });  
            setSaved(true);
        }
    });

    function save() {
        setSaving(1);
    }

    let savebtn;
    let checkbox = false;

    if (typeof props.conditionalAttributes !== "undefined" && typeof props.conditionalAttributes.checked !== "undefined") {
        props.conditionalAttributes.checked = data;
        checkbox = true;
    } else {
        savebtn = <Button onClick={(e) => {            
            e.preventDefault();
            save();
        }}><Upload /></Button>;
    }

    return <><input onChange={(e) => { if (checkbox) { setTarget(e.target.checked); save(); } else { setTarget(e.target.value); }}} type={props.type} id={props.id} name={props.name} value={data} {...props.conditionalAttributes} />{savebtn}</>;
}

ControlInput.propTypes = {
    type: PropTypes.string,
    API: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    sizes: PropTypes.array,
    dataType: PropTypes.string,
    conditionalAttributes: PropTypes.object,
};
