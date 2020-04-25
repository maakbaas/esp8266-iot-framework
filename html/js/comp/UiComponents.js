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
        cursor:pointer;
    
        &:hover {
            color: ${cSecondaryHover};
        }
    }

    svg {
        width:0.9em;
        height:0.9em;
        vertical-align: -0.05em;
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
`;

const HamburgerSrc = ({ className, onClick }) => (
    <a onClick={onClick} className={className}><MenuIcon /></a>
);

export const Hamburger = styled(HamburgerSrc)`

    display:none;

    svg 
    {
        width: 1em;
        height: 1em;
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
            line-height:3.5em;
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

const modal = css`
    position:absolute;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
    z-index:2;
    background-color:#000000e0;

    div:first-child {
        border-radius:6px;
        text-align:center;
        position:relative;
        max-width:calc(100vw - 100px);
        width:400px;
        background-color:#fff;
        padding:1em;
        top:20vh;
        margin:0px auto;
        box-shadow: 0px 0px 50px;

        p {
            margin-top:0px;
            padding:1em 0em;
        }

        div {
            display:flex;
            justify-content:flex-end;    
            align-items: flex-end;

            Button {
                margin-left:0.6em;
            }
        }
    }
`;

const ConfirmationSrc = ({ active, confirm, cancel, className, children }) => (
    active ? <div className={className}
        onClick={() => cancel()}>
        <div onClick={(e) => e.stopPropagation()}><p>{children}</p>
            <div>
                <CancelButton onClick={() => cancel()}>Cancel</CancelButton>
                <Button onClick={() => confirm()}>Continue</Button>
            </div>
        </div>
    </div> : ''
);

export const Confirmation = styled(ConfirmationSrc)`
    ${modal}
`;

const AlertSrc = ({ active, confirm, className, children }) => (
    active ? <div className={className}
        onClick={() => confirm()}>
        <div onClick={(e) => e.stopPropagation()}><p>{children}</p>
            <div>
                <Button onClick={() => confirm()}>OK</Button>
            </div>
        </div>
    </div> : ''
);

export const Alert = styled(AlertSrc)`
    ${modal}
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
    padding:0.5em; 
    border-radius:4px;
    cursor:pointer;

    &:hover {
        background-color: ${cPrimaryHover};
    }
`;

export const Button = styled.button` 
    ${buttonStyle}
`;

export const CancelButton = styled(Button)` 
    color:#cc2200;
    background-color:#fff;
    border:1px solid #cc2200;

    :hover {
        color:#bb3300;
        background-color:#ffeeee;
        border:1px solid #bb3300;
    }
`;

export const RedButton = styled(Button)` 
    background-color:#cc2200;

    :hover {
        background-color:#bb3300;
    }
`;

export const Flex = styled.div`
    display:flex;
    justify-content:space-between;  
    align-items: center;
`;

export const Success = styled.span` 
    color:#a3dd00;
`;

export const Fail = styled.span` 
    color:#ffcc00;
`;

export const Submit = styled.input.attrs({
    type: 'submit'
})`
    ${buttonStyle}  
`;

export const FileLabel = styled.label`
    ${buttonStyle}  

    display:inline-block;
    width:100px;
    text-align:center;

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

export const Spinner = styled(Loader)`    
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
    return <span onClick={() => {
        fetch(props.href)
            .then((response) => { return response.status; })
            .then((status) => { 
                if (status==200) 
                    if (typeof props.onFinished === "function")
                        props.onFinished(); 
            });
    }}>{props.children}</span>;
}

export function Upload(props)
{
    const [state, setState] = useState("");

    var status;
    if (state == "busy")
        status = <><Spinner /></>;
    else 
        status = <>Upload File</>;
    
    var render = 
    <><form action={props.action} method="post" name="upload" enctype="multipart/form-data">
        <FileLabel id="uploadLabel" className={state}>{status}<input type="file" id="file" 
        onClick={(e) => {
            if (state == "busy") {
                e.preventDefault();
            }
        }}
        onChange={(e) => {
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
        </FileLabel>
    </form>
    <Alert active={state == "nok"}
        confirm={() => setState("")}>
        The upload has failed. The file could be too large, or it's name too long (>32).</Alert>
    </>;   

    return render;
}