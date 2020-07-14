import React, { useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import { FileListing } from "./FileListing";
import { Card, Flex, cSecondary, Button, DisabledButton, Confirmation, Alert, Spinner} from "./UiComponents";
import { Zap, Power } from "react-feather";

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
            buttons = <Flex><Button onClick={() => setState(1)}>Back</Button><Button onClick={() => setModal(true)}>Update Firmware</Button></Flex>;
            step = <WizardBox><h1><Zap /></h1><p>You have selected <b>{filename}</b> to be flashed</p></WizardBox>;
        } else {
            buttons = <Flex><DisabledButton>Back</DisabledButton><DisabledButton>Update Firmware</DisabledButton></Flex>;
            step = <WizardBox><h1><Spinner /></h1><p>The firmware <b>{filename}</b> is being flashed</p><p><small>Please be patient, this can take a few minutes. Do not turn off the device!</small></p></WizardBox>;
        }
    } else if (state == 3) {
        step = <WizardBox><h1><Power /></h1><p>The firmware <b>{filename}</b> has been flashed successfully.</p><p>Please restart the device to boot from the new software version.</p><p>            
            <Button onClick={() => { fetch(`${props.API}/api/restart`); setRestart(true);}}>Restart Now</Button>
        </p></WizardBox>;
        buttons = <Button onClick={() => setState(1)}>Back</Button>;
    } else {step = <FileListing API={props.API} selectable={true} onSelect={(name) => {setFilename(name);setState(2);}} filter="bin" />;}
    
    return <><h2>Firmware Update</h2>
    
        <Wizard>
            <h3 className={state == 1 ? "active" : ""}>1. Select</h3>
            <h3 className={state == 2 ? "active" : ""}>2. Flash</h3>
            <h3 className={state == 3 ? "active" : ""}>3. Reboot</h3>
        </Wizard>

        <Card>
            {step}
        </Card>

        {buttons}

        <Confirmation active={modal}
            confirm={() => { setModal(false);startFlashing(); }}
            cancel={() => setModal(false)}>Are you sure? If you continue, the current software version will be overwritten.</Confirmation>

        <Alert active={failed}
            confirm={() => setFailed(false)}>
        The firmware update has failed.</Alert>
    
        <Alert active={restart}
            confirm={() => setRestart(false)}>
            The device is restarting. Please wait a few seconds and refresh this page</Alert>
    </>;  
    
    function startFlashing() {        
        fetch(`${props.API}/api/update?filename=${filename}`)
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

