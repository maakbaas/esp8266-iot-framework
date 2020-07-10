import React, { useState } from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import { Box } from "react-feather";

import {GlobalStyle, Menu, Header, Page, Hamburger} from "./comp/UiComponents";
import { WifiPage } from "./comp/WifiPage";
import { ConfigPage } from "./comp/ConfigPage";
import { FilePage } from "./comp/FilePage";
import { FirmwarePage } from "./comp/FirmwarePage";

let url = "http://192.168.1.54";
if (process.env.NODE_ENV === "production") {url = window.location.origin;}

if (process.env.NODE_ENV === "development") {require("preact/debug");}

function Root() {
    
    const [menu, setMenu] = useState(false);

    return <><GlobalStyle />

        <BrowserRouter>

            <Header>
                <h1><Box style={{verticalAlign:"-0.1em"}} /> ESP8266</h1>

                <Hamburger onClick={() => setMenu(!menu)} />
                <Menu className={menu ? "" : "menuHidden"}>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/">WiFi Settings</NavLink></li>
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
                        <ConfigPage API={url} />
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