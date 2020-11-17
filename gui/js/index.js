import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import { Box } from "react-feather";

import {GlobalStyle, Menu, Header, Page, Hamburger} from "./comp/UiComponents";
import { WifiPage } from "./comp/WifiPage";
import { ConfigPage } from "./comp/ConfigPage";
import { DashboardPage } from "./comp/DashboardPage";
import { FilePage } from "./comp/FilePage";
import { FirmwarePage } from "./comp/FirmwarePage";

import { bin2obj } from "./functions/configHelpers";

import Config from "./configuration.json";
import Dash from "./dashboard.json";

let url = "http://192.168.1.54";
if (process.env.NODE_ENV === "production") {url = window.location.origin;}

if (process.env.NODE_ENV === "development") {require("preact/debug");}

const displayData = new Array();

function Root() {
    
    const [menu, setMenu] = useState(false);
    const [configData, setConfigData] = useState(new Object());
    const [binSize, setBinSize] = useState(0);
    const [socket, setSocket] = useState({});

    useEffect(() => {
        const ws = new WebSocket(url.replace("http://","ws://").concat("/ws"));
        ws.addEventListener("message", wsMessage);
        setSocket(ws);
        fetchData();        
    }, []);

    function wsMessage(event) {
        event.data.arrayBuffer().then((buffer) => {                
            const dv = new DataView(buffer, 0);
            const timestamp = dv.getUint32(0, true);
            displayData.push([timestamp, bin2obj(buffer.slice(8,buffer.byteLength), Dash)]);     
        });        
    }

    function fetchData() {
        fetch(`${url}/api/config/get`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                setBinSize(data.byteLength);
                setConfigData(bin2obj(data, Config));
            });
    }

    const projectName = configData["projectName"] || Config.find(entry => entry.name === "projectName").value || "ESP8266";
    return <><GlobalStyle />

        <BrowserRouter>

            <Header>
                <h1><Box style={{verticalAlign:"-0.1em"}} /> {projectName}</h1>

                <Hamburger onClick={() => setMenu(!menu)} />
                <Menu className={menu ? "" : "menuHidden"}>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/">WiFi Settings</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/config">Configuration</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/files">File Manager</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/firmware">Firmware Update</NavLink></li>
                </Menu>

            </Header>
        
            <Page>
                <Switch>
                    <Route exact path="/files">
                        <FilePage API={url} />
                    </Route>
                    <Route exact path="/config">
                        <ConfigPage API={url} 
                            configData={configData}
                            binSize={binSize}
                            requestUpdate={fetchData} />
                    </Route>
                    <Route exact path="/dashboard">
                        <DashboardPage API={url} 
                            socket={socket}
                            requestData={() => {return displayData;}} />
                    </Route>
                    <Route exact path="/firmware">
                        <FirmwarePage API={url} />
                    </Route>
                    <Route path="/">
                        <WifiPage API={url} />
                    </Route>
                </Switch>
            </Page>

        </BrowserRouter>
    </>;

}



ReactDOM.render(<Root />, document.getElementById("root"));