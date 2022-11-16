import React, { useState, useEffect } from "react";

import { Form, Button, Spinner, Confirmation } from "./UiComponents";
import { FiWifi as Wifi, FiLock as Lock, FiServer as Server, FiCornerDownRight as CornerDownRight } from "react-icons/fi";

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

export function WifiPage(props) {
    const [state, setState] = useState({ captivePortal: [], ssid: []});
    const [forgetModal, setForgetModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [dhcpForm, setDhcpForm] = useState(true);

    useEffect(() => {
        document.title = loc.titleWifi;
        fetch(`${props.API}/api/wifi/get`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(data);
            });
    }, []);

    function changeWifi() {
        if (dhcpForm) {
            fetch(`${props.API}/api/wifi/set?ssid=${encodeURIComponent(document.getElementById("ssid").value.trim())}&pass=${encodeURIComponent(document.getElementById("pass").value.trim())}`, { method: "POST" });
        } else {
            fetch(`${props.API}/api/wifi/setStatic?ssid=${encodeURIComponent(document.getElementById("ssid").value.trim())}&pass=${encodeURIComponent(document.getElementById("pass").value.trim())}&ip=${encodeURIComponent(document.getElementById("ip").value.trim())}&sub=${encodeURIComponent(document.getElementById("sub").value.trim())}&gw=${encodeURIComponent(document.getElementById("gw").value.trim())}&dns=${encodeURIComponent(document.getElementById("dns").value.trim())}`, { method: "POST" });
            document.getElementById("ip").value = "";
            document.getElementById("gw").value = "";
            document.getElementById("sub").value = "";
            document.getElementById("dns").value = "";
            setDhcpForm(true);
        }
        document.getElementById("ssid").value = "";
        document.getElementById("pass").value = "";        
    }

    let dhcp = <></>;

    if (!dhcpForm) {
        dhcp = <>
            <p><label htmlFor="ip"><CornerDownRight /> {loc.wifiIP}:</label>
                <input type="text" id="ip" name="ip" autoCapitalize="none" />
            </p>
            <p><label htmlFor="sub"><CornerDownRight /> {loc.wifiSub}:</label>
                <input type="text" id="sub" name="sub" autoCapitalize="none" />
            </p>
            <p><label htmlFor="gw"><CornerDownRight /> {loc.wifiGW}:</label>
                <input type="text" id="gw" name="gw" autoCapitalize="none" />
            </p>
            <p><label htmlFor="dns"><CornerDownRight /> {loc.wifiDNS}:</label>
                <input type="text" id="dns" name="dns" autoCapitalize="none" />
            </p>
        </>;
    }    

    const form = <><Form>
        <p><label htmlFor="ssid"><Wifi /> {loc.wifiSSID}:</label>
            <input type="text" id="ssid" name="ssid" autoCapitalize="none" />
        </p>
        <p><label htmlFor="pass"><Lock /> {loc.wifiPass}:</label>
            <input type="text" id="pass" name="pass" autoCapitalize="none" />
        </p>   
        <p><label htmlFor="dhcp"><Server /> {loc.wifiDHCP}:</label>
            <input type="checkbox" id="dhcp" name="dhcp" checked={dhcpForm} onChange={()=>setDhcpForm(!dhcpForm)} />
        </p>
        {dhcp}      
    </Form>
    <Button onClick={() => setSaveModal(true)}>{loc.globalSave}</Button>
    </>;
    
    let page = <><h2>{loc.titleWifi}</h2> 
        <h3>{loc.globalStatus}</h3></>;
    
    let connectedTo;
    if (state.captivePortal === true) {
        connectedTo = loc.wifiCP;
    } else if (state.captivePortal === false) {
        connectedTo = <>{loc.wifiConn} {state.ssid} (<a onClick={() => setForgetModal(true)}>{loc.wifiForget}</a>)</>;
    }
    
    page = <>{page}<p>{connectedTo == null ? <Spinner /> : connectedTo}</p></>;

    page = <>{page}<h3>{loc.wifiUpdate}</h3>{form}
        <Confirmation active={forgetModal}
            confirm={() => { fetch(`${props.API}/api/wifi/forget`, { method: "POST" }); setForgetModal(false); }}
            cancel={() => setForgetModal(false)}>{loc.wifiModal1}</Confirmation>
        <Confirmation active={saveModal}
            confirm={() => { changeWifi(); setSaveModal(false); }}
            cancel={() => setSaveModal(false)}>{loc.wifiModal2}</Confirmation>
    </>;

    return page;
}

