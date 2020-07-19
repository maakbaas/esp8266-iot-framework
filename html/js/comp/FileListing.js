import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import { Fetch, Flex, RedButton, Button, buttonStyle, cPrimary, Alert, Spinner } from "./UiComponents";
import { File, Trash2, Download } from "react-feather";

const FileLine = styled(Flex)`
    padding:0.35em 0em;
    border-bottom:1px solid #ddd;
    
    :last-child 
    {
        border-bottom:0px;
    }

    &.selectable {
        span {
            text-decoration:underline;
        }
        cursor:pointer;
        padding-left:0.35em;
        padding-right:0.35em;
    }

    &.selectable:hover {
        background-color:#ff00cc11;
    }

    span
    {
        margin-left:0.6em;
    }

    Button
    {
        padding:0.4em 0.5em;        
    }

    div:first-child
    {
        padding:0.4em 0em;
    }

    svg 
    {
        vertical-align: -0.15em;
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

export function FileListing(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 0});

    useEffect(() => {
        document.title = "File Manager";
        fetchData();
    }, []);

    function fetchData() {
        fetch(`${props.API}/api/files/get`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setState(data);
            });
    }

    let list;
        
    if (state.max > 0) {
        let filtered = 0;
        for (let i = 0; i < state.files.length; i++) {
            if (typeof props.filter === "undefined"
                || state.files[i].substr(state.files[i].length - (props.filter.length + 1)) == `.${props.filter}`) {filtered++;}
        }

        if (filtered == 0) {
            list = <FileLine><div>No files available</div></FileLine>;
        } else {
            for (let i = 0; i < state.files.length; i++) {
                if (typeof props.filter === "undefined" ||
                    state.files[i].substr(state.files[i].length - (props.filter.length + 1)) == `.${props.filter}`) {       
                    const name = state.files[i];         
                    list = <>{list}                        
                        <FileLine className={props.selectable ? "selectable" : ""} onClick={() => {if (typeof props.onSelect !== "undefined") {props.onSelect(name);}}}>
                            <div><File /><span>{state.files[i]}</span></div>
                            <div>
                                <a href={`${props.API}/download/${state.files[i]}`} rel="noreferrer" target="_blank" onClick={(e) => { e.stopPropagation();}}>
                                    <Button title="Download file"><Download /></Button>
                                </a>                
                                <Fetch href={`${props.API}/api/files/remove?filename=${state.files[i]}`} POST onFinished={fetchData}>
                                    <RedButton title="Remove file" ><Trash2 /></RedButton>
                                </Fetch>   
                            </div>
                        </FileLine></>;
                }
            }   
        }  
    } else {
        list = <FileLine><div><Spinner /></div></FileLine>;
    }


    let header;
    if (props.selectable) {
        header = "Select a file:";
    } else {
        header = "File list";
    }

    return <><Flex>
        <div><Upload action={`${props.API}/upload`} onFinished={fetchData} filter={props.filter} /></div>
        {parseInt(state.max) > 0 ? <div>{Math.round(state.used / 1000)} / {Math.round(state.max / 1000)} kB used</div> : ""}
    </Flex><h3>{header}</h3>{list}</>;
    
}

FileListing.propTypes = {
    API: PropTypes.string,
    onSelect: PropTypes.func,
    filter: PropTypes.string,
    selectable: PropTypes.bool,
};


function Upload(props) {
    const [state, setState] = useState("");

    let status;
    if (state == "busy") {status = <><Spinner /></>;} else {status = <>Upload File</>;}

    const render =
        <><form action={props.action} method="post" name="upload" encType="multipart/form-data">
            <FileLabel id="uploadLabel" className={state}>{status}<input type="file" id="file"
                onClick={(e) => {
                    if (state == "busy") {
                        e.preventDefault();
                    }
                }}
                onChange={(e) => {
                    const form = document.forms.namedItem("upload");
                    const files = e.target.files;
                    const formData = new FormData();

                    if (files.length > 0) {
                        if (typeof props.filter === "undefined"
                            || files[0].name.substr(files[0].name.length - (props.filter.length + 1)) == `.${props.filter}`) {
                            setState("busy");

                            formData.append("myFile", files[0]);

                            fetch(form.action, {
                                method: "POST",
                                body: formData,
                            }).then((response) => { return response.json(); })
                                .then((data) => {
                                    if (data.success == true) {
                                        setState("ok");
                                        props.onFinished();
                                    } else {
                                        setState("nok");
                                    }
                                });
                        } else {
                            setState("wrongtype");
                        }

                    }
                }} />
            </FileLabel>
        </form>
        <Alert active={state == "nok"}
            confirm={() => setState("")}>
                The upload has failed. The file could be too large, or it&apos;s name too long ({">"}32).</Alert>
        <Alert active={state == "wrongtype"}
            confirm={() => setState("")}>
                The selected file is not of the correct type (.{props.filter})</Alert>
        </>;

    return render;
}

const FileLabel = styled.label`
    ${buttonStyle}  

    display:inline-block;
    width:100px;
    text-align:center;
    
    @media (max-width: 500px) 
    {
        width:90px; 
    }

    &.busy 
    {
        cursor: default;
        :hover
        {
            background-color: ${cPrimary};
        }
    }

    svg {
        width:1.2em;
        height:1.2em;
        vertical-align:-0.25em;
    }

    input[type="file"] {
        display: none;
    } 
`;