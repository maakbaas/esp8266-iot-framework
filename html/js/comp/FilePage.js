import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Fetch, Upload, Flex, RedButton, Button } from './UiComponents'
import { File, Trash2, Download } from 'react-feather';

const FileLine = styled(Flex)`
    padding-bottom:0.7em;
    margin-bottom:0.7em;
    border-bottom:1px solid #ddd;
    
    :last-child 
    {
        border-bottom:0px;
    }

    span
    {
        margin-left:0.7em;
    }

    Button 
    {
        padding:0.4em;        
    }

    @media (max-width: 500px) 
    {
        flex-wrap:wrap;
        div:first-child {
            width:100%;
            margin-bottom:0.4em;
        }
    }
`;

export function FilePage(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 0});

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
            list = <>{list}
            <FileLine>
                <div><File /> {state.files[i]}</div>
                <div>
                    <a href={props.API + '/download/' + state.files[i]} target="_blank">
                        <Button title="Download file"><Download /></Button>
                    </a>                
                    <Fetch href={props.API + '/api/files/remove?filename=' + state.files[i]} onFinished={fetchData}>
                        <RedButton title="Remove file" ><Trash2 /></RedButton>
                    </Fetch>   
                </div>
            </FileLine></>;
        }   
    }    

    return <><h2>File Manager</h2><Flex>
        <p><Upload action={props.API + '/upload'} onFinished={fetchData} /></p>
        {parseInt(state.max)>0 ? <p>{Math.round(state.used / 1000)} / {Math.round(state.max / 1000)} kB in use</p> : ""}
    </Flex>{list}</>;
    
}