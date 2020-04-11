import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { normalize } from 'styled-normalize'
import { Loader } from 'react-feather';

export const GlobalStyle = createGlobalStyle`
  
    ${normalize}

    body {
        margin:1em;
        font-size:1.2em;
        line-height:1.4em;
    }

    * {
        font-family: Arial, sans-serif;
    }

    a {
        color: #ff00cc;
        text-decoration: none;
    
        &:hover {
            color: #cc0099;
        }
    }

    svg {
         width:0.9em;
         height:0.9em;
         vertical-align: -0.05em;
    }
  
`

export const Menu = styled.ul`
    list-style: none;
    padding-left:0px;
`;

export const Form = styled.form` 
    label {
        display: inline-block;
        min-width: 150px;
    }
`;

const buttonStyle = css` 
    background-color: #0055ff;
    color:#fff;
    border:none;
    padding:0.4em; 
    border-radius:3px;
    cursor:pointer;

    &:hover {
        background-color: #0033dd;
    }
`;

export const Button = styled.button` 
    ${buttonStyle}
`;

export const Success = styled.span` 
    color:#a3dd00;
`;

export const Fail = styled.span` 
    color:#dd2211;
`;

export const Submit = styled.input.attrs({
    type: 'submit'
})`
    ${buttonStyle}  
`;

export const FileLabel = styled.label`
    ${buttonStyle}  

    min-width:0px !important;

    input[type="file"] {
        display: none;
    } 
`;

export const Spinner = styled(Loader)`
    width:1.3em;
    height:1.3em;
    vertical-align:-0.3em;
    animation-name: spin;
    animation-duration: 3000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear; 

    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
`;

export function Fetch(props)
{
    return <a href={props.href} onClick={(e) => {
        e.preventDefault();
        fetch(e.currentTarget.getAttribute('href'))
            .then((response) => { return response.status; })
            .then((status) => { if (status==200) props.onFinished(); });
    }}>{props.text}</a>;
}

export function Upload(props)
{
    const [state, setState] = useState("");

    var status;
    if (state=="ok")
        status=<Success>Upload finished</Success>;
    else if (state == "nok")
        status = <Fail>Upload failed</Fail>;
    else if (state == "busy")
        status = <span>Uploading <Spinner /></span>;

    
    var render = 
    <form action={props.action} method="post" name="upload" enctype="multipart/form-data">
        <FileLabel id="uploadLabel">Upload file<input type="file" id="file" onChange={(e) => {

            var form = document.forms.namedItem("upload");
            const files = e.target.files;
            const formData = new FormData();

            if (files.length>0)
            {
                setState("busy");

                formData.append('myFile', files[0]);

                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                }).then((response) => { return response.json(); })
                    .then((data) => { 
                        if (data.success == true) 
                        {
                            setState("ok");
                            props.onFinished(); 
                        } else {
                            setState("nok");
                        }
                    });
            }
        }} />
        </FileLabel> {status}
    </form>;

    return render;
}