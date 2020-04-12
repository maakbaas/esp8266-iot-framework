import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

import {GlobalStyle, Menu} from './comp/UiComponents'
import { WifiPage } from './comp/WifiPage'
import { FilePage } from './comp/FilePage'
import { FirmwarePage } from './comp/FirmwarePage'

if (process.env.NODE_ENV === 'production')
    var url = window.location.origin;
else
    var url = 'http://192.168.1.54';

var page = <>
    <GlobalStyle />

    <BrowserRouter>

        <h1>ESP8266</h1>

        <Menu>
            <li><Link to="/">WiFi Settings</Link></li>
            <li><Link to="/files">File Manager</Link></li>
            <li><Link to="/firmware">Firmware Update</Link></li>
        </Menu>
        
        <Switch>
            <Route exact path="/files">
                <FilePage API={url} />
            </Route>
            <Route exact path="/firmware">
                <FirmwarePage API={url} />
            </Route>
            <Route path="/">
                <WifiPage API={url} />
            </Route>
        </Switch>

    </BrowserRouter>
</>



ReactDOM.render(page, document.getElementById('root'));