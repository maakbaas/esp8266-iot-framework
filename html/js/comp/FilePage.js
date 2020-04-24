import React, { useState, useEffect } from 'react'

import { Fetch, Upload } from './UiComponents'
import { File } from 'react-feather';

export function FilePage(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 1});

    useEffect(() => {
        document.title = `File Manager`;
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

    var list = <h3>File list</h3>;;
        
    if (state.files.length==0)
    {
        list = <>{list}<p>No files available</p></>;
    } 
    else
    {
        for (var i = 0; i < state.files.length; i++) {
            list = <>{list}<p><File /> {state.files[i]} (<Fetch href={props.API + '/api/files/remove?filename=' + state.files[i]} text="Remove" onFinished={fetchData} />)</p></>;
        }   
    }    

    return <><h2>File Manager</h2><h3>New file</h3><p><Upload action={props.API + '/upload'} onFinished={fetchData} /></p>{list}</>;
    
}