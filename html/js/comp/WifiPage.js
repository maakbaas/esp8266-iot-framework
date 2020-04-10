import React, { useState, useEffect } from 'react'

import { Form, Submit } from './UiComponents'

export function WifiPage(props) {
    const [state, setState] = useState({ captivePortal: false, ssid: '', received: false });

    useEffect(() => {
        document.title = `WiFi Settings`;
        fetch(props.API + '/api/wifi/get')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(Object.assign(data, { received: true }));
            });
    }, []);

    const forget = <a href={props.API + '/api/wifi/forget'} onClick={(e) => { fetch(e.currentTarget.getAttribute('href')); e.preventDefault(); }}>Forget</a>;

    var connectStatus;
    if (state.received) {
        if (state.captivePortal) {
            connectStatus = <><h3>Status</h3><p>{"Captive portal running"}</p></>;
        }
        else {
            connectStatus = <><h3>Status</h3><p>{"Connected to " + state.ssid + " "} ({forget})</p></>;
        }
    }

    var form = <Form onSubmit={(e) => {changeWifi(e,props)}}>
        <p><label for="ssid">SSID:</label>
            <input type="text" name="ssid" />
        </p>
        <p><label for="pass">Password:</label>
            <input type="text" name="pass" />
        </p>
        <Submit value="Save" />
    </Form>

    return <>
        <h2>WiFi Settings</h2>
        {connectStatus}
        <h3>Update credentials</h3>
        {form}
    </>;
}

function changeWifi(e,props)
{
    e.preventDefault();
    fetch(props.API + '/api/wifi/set?ssid=' + e.target.ssid.value + '&pass=' + e.target.pass.value);  
    e.target.ssid.value = '';  
    e.target.pass.value = '';  
}