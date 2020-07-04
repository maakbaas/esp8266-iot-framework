import React, { useState, useEffect } from 'react'

import { Form, Button, Spinner, Confirmation } from './UiComponents'
import { Wifi, Lock } from 'react-feather';

export function WifiPage(props) {
    const [state, setState] = useState({ captivePortal: [], ssid: []});
    const [forgetModal, setForgetModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);

    useEffect(() => {
        document.title = `WiFi Settings`;
        fetch(props.API + '/api/wifi/get')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(data);
            });
    }, []);

    function changeWifi() {
        fetch(props.API + '/api/wifi/set?ssid=' + document.getElementById("ssid").value.trim() + '&pass=' + document.getElementById("pass").value.trim())
        document.getElementById("ssid").value = '';
        document.getElementById("pass").value = '';
    }

    var form = <><Form>
        <p><label for="ssid"><Wifi /> SSID:</label>
            <input type="text" id="ssid" name="ssid" autocapitalize="none" />
        </p>
        <p><label for="pass"><Lock /> Password:</label>
            <input type="text" id="pass" name="pass" autocapitalize="none" />
        </p>        
    </Form>
    <Button onClick={(e) => setSaveModal(true)}>Save</Button>
    </>
    
    var page = <><h2>WiFi Settings</h2> 
    <h3>Status</h3></>;
    
    var connectedTo;
    if (state.captivePortal === true) {
        connectedTo = "Captive portal running";
    }
    else if (state.captivePortal === false) {
        connectedTo = <>Connected to {state.ssid} (<a onClick={() => setForgetModal(true)}>Forget</a>)</>;
    }
    
    page = <>{page}<p>{connectedTo == null ? <Spinner /> : connectedTo}</p></>;

    page = <>{page}<h3>Update credentials</h3>{form}
        <Confirmation active={forgetModal}
            confirm={() => { fetch(props.API + '/api/wifi/forget'); setForgetModal(false) }}
            cancel={() => setForgetModal(false)}>Are you sure? If you continue, a captive portal will be started.</Confirmation>
        <Confirmation active={saveModal}
            confirm={() => { changeWifi(); setSaveModal(false) }}
            cancel={() => setSaveModal(false)}>Are you sure? If you continue, device access from the current network will probably be lost.</Confirmation>
    </>;

    return page;
}

