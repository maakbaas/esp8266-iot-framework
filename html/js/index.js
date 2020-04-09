import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

import {GlobalStyle, Menu} from './comp/UiComponents'
import {WifiPage} from './comp/WifiPage'

if (process.env.NODE_ENV === 'production')
    var url = window.location.origin;
else
    var url = 'http://192.168.1.54';

var page = <>
    <GlobalStyle />

    <BrowserRouter>

        {/* <h1>Welcome</h1>

        <Menu>
            <li><Link to="/">WiFi</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/plugins">Plugins</Link></li>
            <li><Link to="/update">Update</Link></li>
        </Menu> */}
        
        <Switch>
            <Route exact path="/settings" component={Settings}></Route>
            <Route exact path="/plugins" component={Plugins}></Route>
            <Route exact path="/update" component={Update}></Route>
            <Route path="/">
                <WifiPage API={url} />
            </Route>
        </Switch>

    </BrowserRouter>
</>

function Settings() {
    useEffect(() => {
        document.title = `Settings`;
    });
    return <h2>Settings</h2>;
}

function Plugins() {
    useEffect(() => {
        document.title = `Plugins`;
    });
    return <h2>Plugins</h2>;
}

function Update() {
    useEffect(() => {
        document.title = `Update`;
    });
    return <h2>Update</h2>;
}

ReactDOM.render(page, document.getElementById('root'));