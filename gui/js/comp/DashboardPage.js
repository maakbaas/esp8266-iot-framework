import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Dash from "../dashboard.json";

import { Form } from "./UiComponents";
import { Dashboard } from "./Dashboard";

export function DashboardPage(props) {

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        document.title = "Configuration";
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCounter(counter => counter + 1);
        }, 40); //refresh with 25FPS

        return () => clearTimeout(timer);

    }, [counter]);

    const dashboardData = props.requestData();
    
    const confItems = <Dashboard items={Dash} data={dashboardData} />;

    const form = <><Form>
        {confItems}
    </Form>
    </>;

    return <><h2>Dashboard</h2><p>{form}</p></>;

}

DashboardPage.propTypes = {    
    requestData: PropTypes.func,
};
