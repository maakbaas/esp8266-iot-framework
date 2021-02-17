import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import { FileListing } from "./FileListing";
import { Card, Flex, cSecondary, Button, DisabledButton, Confirmation, Alert, Spinner} from "./UiComponents";
import { Zap, Power } from "react-feather";

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

const WizardBox = styled.div`
    text-align:center;
`;

const Wizard = styled(Flex)`
    
    h3 {
        margin-top:0px;
        width:32%;
        padding-bottom:0.3em;
        border-bottom:3px solid #000;

        svg {
            float:right;
        }
    }
    
    .active {
        color: ${cSecondary};
        border-color: ${cSecondary};
    }

    @media (max-width: 750px) 
    {
        flex-wrap:wrap;
        h3 
        {
            width:100%;
        }
    }
`;

export function FirmwarePage(props) {

    useEffect(() => {
        document.title = loc.titleFw;
    }, []);

    const [state, setState] = useState(1);
    const [filename, setFilename] = useState("");
    const [modal, setModal] = useState(false);
    const [restart, setRestart] = useState(false);
    const [failed, setFailed] = useState(false);
    const [busy, setBusy] = useState(false);

    let step;
    let buttons;
    if (state == 2) {        
        if (!busy) {
            buttons = <Flex><Button onClick={() => setState(1)}>{loc.globalBack}</Button><Button onClick={() => setModal(true)}>{loc.fwBtn}</Button></Flex>;
            step = <WizardBox><h1><Zap /></h1><p>{loc.fwStep1a_preFilename} <b>{filename}</b> {loc.fwStep1b_postFilename}</p></WizardBox>;
        } else {
            buttons = <Flex><DisabledButton>{loc.globalBack}</DisabledButton><DisabledButton>{loc.fwBtn}</DisabledButton></Flex>;
            step = <WizardBox><h1><Spinner /></h1><p>{loc.fwStep2a_preFilename} <b>{filename}</b> {loc.fwStep2b_postFilename}</p><p><small>{loc.fwStep2c}</small></p></WizardBox>;
        }
    } else if (state == 3) {
        step = <WizardBox><h1><Power /></h1><p>{loc.fwStep3a_preFilename} <b>{filename}</b> {loc.fwStep3b_postFilename}</p><p>{loc.fwStep3c}</p><p>            
            <Button onClick={() => { fetch(`${props.API}/api/restart`, { method: "POST" }); setRestart(true);}}>{loc.fwBtn2}</Button>
        </p></WizardBox>;
        buttons = <Button onClick={() => setState(1)}>{loc.globalBack}</Button>;
    } else {step = <FileListing API={props.API} selectable={true} onSelect={(name) => {setFilename(name);setState(2);}} filter="bin" />;}
    
    return <><h2>{loc.titleFw}</h2>
    
        <Wizard>
            <h3 className={state == 1 ? "active" : ""}>1. {loc.fwSelect}</h3>
            <h3 className={state == 2 ? "active" : ""}>2. {loc.fwFlash}</h3>
            <h3 className={state == 3 ? "active" : ""}>3. {loc.fwReboot}</h3>
        </Wizard>

        <Card>
            {step}
        </Card>

        {buttons}

        <Confirmation active={modal}
            confirm={() => { setModal(false);startFlashing(); }}
            cancel={() => setModal(false)}>{loc.fwModal1}</Confirmation>

        <Alert active={failed}
            confirm={() => setFailed(false)}>
            {loc.fwModal2}</Alert>
    
        <Alert active={restart}
            confirm={() => setRestart(false)}>
            {loc.fwModal3}</Alert>
    </>;  
    
    function startFlashing() {        
        fetch(`${props.API}/api/update?filename=${filename}`, { method: "POST" })
            .then((response) => { return response.status; })
            .then((status) => {
                if (status == 200) {
                    setBusy(true);
                    pollStatus();                                        
                }                    
            });
    }

    function pollStatus() {
        fetch(`${props.API}/api/update-status`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status == 1) {
                    setBusy(false);
                    setState(3);
                } else if (data.status == 254) {
                    setTimeout(pollStatus,2000);
                } else {
                    setBusy(false);
                    setState(1);
                    setFailed(true);
                }
            });

                    
    }
}

FirmwarePage.propTypes = {
    API: PropTypes.string,
};

