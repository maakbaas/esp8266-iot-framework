import React, { useState, useEffect } from 'react'

import { Form, FileLabel } from './UiComponents'

export function FilePage(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 1, received: false, update: false});

    useEffect(() => {
        document.title = `File Manager`;
        fetch(props.API + '/api/files/get')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(Object.assign(data, { received: true }));
            });
    }, [state.update]);

    const form = <form action={props.API + '/upload'} method="post" name="upload" enctype="multipart/form-data">
        <FileLabel id="uploadLabel">Upload file<input type="file" id="file" onChange={(e) => {

            var form = document.forms.namedItem("upload");
            e.Value = 'test';
            const files = e.target.files;
            const formData = new FormData();
            formData.append('myFile', files[0]);

            fetch(form.action, {
                method: 'POST',
                body: formData,
            }).then(setState({ update: !state.update }));

        }} />
        </FileLabel>
    </form>;

    var list;
    if (state.received)
    { 
        list = <h3>File list</h3>;        
        if (state.files.length==0)
        {
            list = <>{list}<p>No files available</p></>;
        } 
        else
        {
            for (var i = 0; i < state.files.length; i++) {
                list = <>{list}<p>{state.files[i]} (<a href={props.API + '/api/files/remove?filename=' + state.files[i]} onClick={(e) => {
                    e.preventDefault();
                    fetch(e.currentTarget.getAttribute('href')).then(setState({ update: !state.update }));                     
                }}>Remove</a>)</p></>;
            }   
        }
    }

    return <><h2>File Manager</h2><h3>New file</h3><p>{form}</p>{list}</>;
    
}