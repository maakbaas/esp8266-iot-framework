import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Button } from "./UiComponents";
import { FiUpload as Upload } from "react-icons/fi";

import Dash from "../dashboard.json";
import { binsize } from "./../functions/configHelpers";

export function ControlItem(props) {

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
    });

    useEffect(() => {
        if (saving && target != null) {
            const sizes = binsize(props.name, Dash);
            const binData = new ArrayBuffer(sizes[1]);
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
            fetch(`${props.API}/api/dash/set?start=${sizes[0]}&length=${sizes[1]}`, {
                method: "post",
                body: binData,
            });  
            setSaved(true);
        }
    }, [saving, target]);

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

    return <><input onClick={(e) => { if (checkbox) { setTarget(e.target.checked); save(); } else { setTarget(e.target.value); } }} type={props.type} id={props.name} name={props.name} value={data} {...props.conditionalAttributes} />{savebtn}</>;
}

ControlItem.propTypes = {
    type: PropTypes.string,
    API: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    sizes: PropTypes.array,
    dataType: PropTypes.string,
    conditionalAttributes: PropTypes.object,
};
