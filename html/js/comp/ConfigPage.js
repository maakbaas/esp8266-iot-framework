import React, { useState, useEffect } from 'react'

export function ConfigPage(props) {
    // const [state, setState] = useState({ files: [], used: 0, max: 1});

    useEffect(() => {
        document.title = `Configuration`;
        // fetchData();
    }, []);

    // function fetchData() {
    //     fetch(props.API + '/api/files/get')
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setState(data);
    //         });
    // }

    return <><h2>Configuration</h2></>;
    
}