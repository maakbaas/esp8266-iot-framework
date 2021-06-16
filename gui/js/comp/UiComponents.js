import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { normalize } from "styled-normalize";
import { FiLoader as Loader, FiMenu as MenuIcon } from "react-icons/fi";
import PropTypes from "prop-types";

export const cPrimary = "#0055ff"; 
export const cPrimaryHover = "#0066ee"; 
export const cHeader = "#111";
export const cHeaderHover = "#333"; 
export const cSecondary = "#ff00cc";
export const cSecondaryHover = "#cc0099"; 

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

export const GlobalStyle = createGlobalStyle`
  
    ${normalize}

    body {
        font-size:1.2em;
        line-height:1.4em;

        @media (max-width: 500px) 
        { 
            font-size:1em;
        }
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

    label > svg, button > svg, h1 > svg {
        width:0.9em;
        height:0.9em;
        vertical-align: -0.05em;
    }

    label {
        @media (max-width: 760px) {
            display: block !important;
            max-width: initial !important;
        }
    }
`;

const HeaderSrc = ({ className, children }) => (
    <div className={className}><div>{children}</div></div>
);


HeaderSrc.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Header = styled(HeaderSrc)`
    background-color: ${cHeader};   
    padding:0.3em 0em; 

    h1 {
        margin:0.5em 0em;
    }

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
        margin-right:1em;
        border-radius:3px;
    }

    li:last-of-type a {
        margin-right:0px;
    }

    a:hover {
        color:#fff;
        background-color: ${cHeaderHover};
    }

    a.active {
    background-color: #fff;
    color:${cHeader};
    }

    @media (max-width: 1024px) 
    {    
        h1 {
            font-size:1.3em;
        }
    }

`;

export const Page = styled.div`
        margin:0px auto;
        padding:0em 1em;
        max-width:1024px;
        clear:both;
`;

export const Card = styled.div`

    border-radius:5px;
    border:1px solid #ddd;
    box-shadow:0px 0px 4px #eee;
    padding:2em;
    margin-bottom:1em;

    @media (max-width: 500px) 
    { 
        padding:1em;
    }

`;

const HamburgerSrc = ({ className, onClick }) => (
    <a onClick={onClick} className={className}><MenuIcon /></a>
);

HamburgerSrc.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export const Hamburger = styled(HamburgerSrc)`

    display:none;
    margin-right:0px !important;

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
                <CancelButton onClick={() => cancel()}>{loc.globalCancel}</CancelButton>
                <Button onClick={() => confirm()}>{loc.globalContinue}</Button>
            </div>
        </div>
    </div> : ""
);

ConfirmationSrc.propTypes = {
    active: PropTypes.bool,
    confirm: PropTypes.func,
    cancel: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Confirmation = styled(ConfirmationSrc)`
    ${modal}
`;

const AlertSrc = ({ active, confirm, className, children }) => (
    active ? <div className={className}
        onClick={() => confirm()}>
        <div onClick={(e) => e.stopPropagation()}><p>{children}</p>
            <div>
                <Button onClick={() => confirm()}>{loc.globalOk}</Button>
            </div>
        </div>
    </div> : ""
);

AlertSrc.propTypes = {
    active: PropTypes.bool,
    confirm: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Alert = styled(AlertSrc)`
    ${modal}
`;

export const Form = styled.form` 
    label {
        display: inline-block;
        min-width: 250px;
        max-width: 250px;
        padding-right:1em;
    }

    input[type=number],
    input[type=checkbox],
    input[type=text] {
        width:450px;
        max-width:100%;
        box-sizing: border-box;
        padding:0.3em;
    }

    select {
        width:450px;
        padding: 0.3em;
        max-width:100%;
    }

    input[type=color]
    {
        display:inline-block;
        margin-left:-2px;
        width: 48px;
        height:32px;
        border-radius: 3px;
        border:none;
        outline: none;
        -webkit-appearance: none;      
        cursor:pointer;  
        background-color:#fff;
        vertical-align: middle;
    }

    input[type=color]::-webkit-color-swatch-wrapper {
        padding: 0;	
    }
    input[type=color]::-webkit-color-swatch {
        border-radius: 3px;
    }

    input[type=checkbox] {
        width: auto;
        margin:12px 0px;
    }
`;

export const buttonStyle = css` 
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

export const DisabledButton = styled.button`
        ${buttonStyle}
        cursor:not-allowed;
        background-color:#bbddff;
        :hover {
            background-color:#bbddff;
        }
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
    type: "submit",
})`
    ${buttonStyle}  
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

export function Fetch(props) {
    return <span onClick={(e) => {
        e.stopPropagation();
        if (typeof props.POST !== undefined) {
            fetch(props.href,
                {
                    method: "POST",
                })
                .then((response) => { return response.status; })
                .then((status) => { 
                    if (status == 200) {
                        if (typeof props.onFinished === "function") {props.onFinished();}
                    } 
                });
        } else {
            fetch(props.href)
                .then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {
                        if (typeof props.onFinished === "function") { props.onFinished(); }
                    }
                });  
        }
    }}>{props.children}</span>;
}

Fetch.propTypes = {
    href: PropTypes.string,
    POST: PropTypes.bool,
    onFinished: PropTypes.func,
    children: PropTypes.any,
};