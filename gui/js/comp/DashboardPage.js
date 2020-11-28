import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Dash from "../dashboard.json";

import { Form } from "./UiComponents";
import { DashboardItems } from "./DashboardItems";

import styled from "styled-components";

const Live = styled.span`
    color:#c4e052 !important;
    border: 1px solid #c4e052;
    background-color:#e6f9b8;     
    border-radius:3px;
    font-size:0.5em !important;  
    padding:0.2em; 
    vertical-align:0.3em;
`;

const Connecting = styled.span`
    color:#ddd !important;
    border: 1px solid #ddd;
    background-color:#f4f4f4;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

const Disconnected = styled.span`
    color:#ff3333 !important;
    border: 1px solid #ff3333;
    background-color:#ffb3b3;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

export function DashboardPage(props) {

    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCounter(counter => counter + 1);
            if (!(socketStatus == 0 && props.socket.readyState != 1)) {
                setSocketStatus(props.socket.readyState);
            }
        }, 40); //refresh with 25FPS

        return () => clearTimeout(timer);

    }, [counter]);

    const dashboardData = props.requestData();
    
    const confItems = <DashboardItems API={props.API} items={Dash} data={dashboardData} />;

    const form = <><Form>
        {confItems}
    </Form>
    </>;

    return <><h2>Dashboard {socketStatus != 0 ? socketStatus == 1 ? <Live>LIVE</Live> : <Disconnected>DISCONNECTED</Disconnected> : <Connecting>CONNECTING</Connecting>}</h2><p>{form}</p></>;

}

DashboardPage.propTypes = {    
    requestData: PropTypes.func,
    API: PropTypes.string,
    socket: PropTypes.object,
};
