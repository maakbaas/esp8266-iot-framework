import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { normalize } from 'styled-normalize'
import { Loader, Menu as MenuIcon } from 'react-feather';

const cPrimary = '#0055ff'; 
const cPrimaryHover = '#0066ee'; 
const cHeader = '#111';
const cHeaderHover = '#333'; 
const cSecondary = '#ff00cc';
const cSecondaryHover = '#cc0099'; 

export const GlobalStyle = createGlobalStyle`
  
    ${normalize}

    body {
        font-size:1.2em;
        line-height:1.4em;
    }

    * {
        font-family: Arial, sans-serif;
    }

    a {
        color: ${cSecondary};
        text-decoration: none;
    
        &:hover {
            color: ${cSecondaryHover};
        }
    }
  
`

const HeaderSrc = ({ className, children }) => (
    <div className={className}><div>{children}</div></div>
);

export const Header = styled(HeaderSrc)`
    background-color: ${cHeader};    
    div:first-child {
        margin:0px auto;
        padding:0em 1em;
        max-width:1024px;
        
        display:flex;
        flex-wrap: wrap;
        justify-content:space-between;    
        align-items: center;
        h1 {
            color:#fff;
        }
    }  
    
    a {
        color: #fff;
        padding:0.6em;
        margin-left:1em;
        border-radius:3px;
        cursor:pointer;
    }

    a:hover {
        color:#fff;
        background-color: ${cHeaderHover};
    }

    a.active {
    background-color: #fff;
    color:${cHeader};
    }
`;

export const Page = styled.div`
        margin:0px auto;
        padding:0em 1em;
        max-width:1024px;
        clear:both;

        svg {
            width:0.9em;
            height:0.9em;
            vertical-align: -0.05em;
        }
`;

const HamburgerSrc = ({ className, onClick }) => (
    <a onClick={onClick} className={className}><MenuIcon /></a>
);

export const Hamburger = styled(HamburgerSrc)`

    display:none;

    svg 
    {
        vertical-align:-0.25em;
    }

    @media (max-width: 1024px) 
    {    
        display:inline;
    }

`;

export const Menu = styled.ul`
    display:flex;
    padding:0px;
    list-style: none;     
    
    @media (max-width: 1024px) 
    {   
        display:block;
        width:100%;
        background-color:#444;
        margin:0px -1em;
        padding:0em 1em;

        a {
            display:block;
            line-height:3.2em;
            margin:0px -1em;
            padding:0px 1em;
            border-radius:0;
            width:100%;
        }

        a.active {
            background-color:#555;
            color:#fff;
        }

        &.menuHidden 
        {
            display:none;
        }
    }
`;


export const Form = styled.form` 
    label {
        display: inline-block;
        min-width: 150px;
    }
`;

const buttonStyle = css` 
    background-color: ${cPrimary};
    color:#fff;
    border:none;
    padding:0.4em; 
    border-radius:3px;
    cursor:pointer;

    &:hover {
        background-color: ${cPrimaryHover};
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
            .then((status) => { 
                if (status==200) 
                    if (typeof props.onFinished === "function")
                        props.onFinished(); 
            });
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