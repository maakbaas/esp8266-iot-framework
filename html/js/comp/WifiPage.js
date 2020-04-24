import React, { useState, useEffect } from 'react'

import { Form, Submit, Fetch } from './UiComponents'
import { Wifi, Lock } from 'react-feather';

export function WifiPage(props) {
    const [state, setState] = useState({ captivePortal: [], ssid: []});

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

    function changeWifi(e) {
        e.preventDefault();
        fetch(props.API + '/api/wifi/set?ssid=' + e.target.ssid.value + '&pass=' + e.target.pass.value);
        e.target.ssid.value = '';
        e.target.pass.value = '';
    }

    var form = <Form onSubmit={changeWifi}>
        <p><label for="ssid"><Wifi /> SSID:</label>
            <input type="text" name="ssid" />
        </p>
        <p><label for="pass"><Lock /> Password:</label>
            <input type="text" name="pass" />
        </p>
        <Submit value="Save" />
    </Form>
    
    var page = <><h2>WiFi Settings</h2> 
    <h3>Status</h3></>;
    
    var connectedTo;
    if (state.captivePortal === true) {
        connectedTo = "Captive portal running";
    }
    else if (state.captivePortal === false) {
        connectedTo = <>Connected to {state.ssid} (<Fetch href={props.API + '/api/wifi/forget'} text="Forget" />)</>;
    }
    
    page = <>{page}<p>{connectedTo}</p></>;

    page = <>{page}<h3>Update credentials</h3>{form}</>;

    return page;
}

