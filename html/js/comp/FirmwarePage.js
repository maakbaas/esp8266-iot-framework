import React, { useState, useEffect } from 'react'

import { Fetch, Upload } from './UiComponents'
import { File } from 'react-feather';

export function FirmwarePage(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 1});

    useEffect(() => {
        document.title = `Firmware Update`;
        fetchData();
    }, []);

    function fetchData() {
        fetch(props.API + '/api/files/get')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(data);
            });
    }

    var list = <h3>Available images</h3>;;
        
    var images = 0;
    for (var i = 0; i < state.files.length; i++) {
        if (state.files[i].substr(state.files[i].length-4)==".bin")
            images++;
    }

    if (images==0)
    {
        list = <>{list}<p>No files available</p></>;
    } 
    else
    {
        for (var i = 0; i < state.files.length; i++) {
            if (state.files[i].substr(state.files[i].length - 4) == ".bin")
                list = <>{list}<p><File /> {state.files[i]} (<Fetch href={props.API + '/api/update?filename=' + state.files[i]} text="Flash" />)</p></>;
        }   
    }    

    return <><h2>Firmware Update</h2><h3>Upload firmware</h3><p><Upload action={props.API + '/upload'} onFinished={fetchData} /></p>{list}</>;
    
}