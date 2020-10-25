import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { normalize } from "styled-normalize";
import { Loader, Menu as MenuIcon } from "react-feather";
import PropTypes from "prop-types";
import ReactSlider from 'react-slider';

export const cPrimary = "#6699cc"; 
export const cPrimaryHover = "#99ccff"; 
export const cHeader = "#111";
export const cHeaderHover = "#333"; 
export const cSecondary = "#ff00cc";
export const cSecondaryHover = "#cc0099"; 

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

    svg {
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
    

    .horizontal-slider {
        max-width: 100%;
        height: 38px;
        border: 0px solid grey;
    }

    .vertical-slider {
        height: 380px;
        width: 38px;
        border: 1px solid grey;
    }

    .slider-thumb {
        font-size: 0.8em;
        text-align: center;
        background-color: white;
        color: black;
        cursor: pointer;
        border: 4px solid #ccc;
        box-shadow:0 0 4px #aaa;
        box-sizing: border-box;
        border-radius: 50%;
    }

    .slider-thumb.active {
        outline:none;
        border-color:${cPrimaryHover};
        box-shadow:0 0 10px ${cPrimaryHover};
    }

    .slider-track {
        position: relative;
        background: ${cPrimary};
        border-radius: 999px;
    }

    .slider-track.slider-track-1 {
        background: #ddd;
    }

    .slider-track.slider-track-2 {
        background: #0f0;
    }

    .horizontal-slider .slider-track {
        top: 16px;
        height: 8px;
    }

    .horizontal-slider .slider-thumb {
        top: 1px;
        width: 40px;
        height: 38px;
        line-height: 30px;
    }

    .vertical-slider .slider-thumb {
        left: 1px;
        width: 38px;
        height: 40px;
        line-height: 30px;
    }

    .vertical-slider .slider-track {
        left: 16px;
        width: 8px;
    }    


    .react-toggle {
        touch-action: pan-x;
      
        display: inline-block;
        position: relative;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        padding: 0;
      
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-tap-highlight-color: transparent;
      }
      
      .react-toggle-screenreader-only {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }
      
      .react-toggle--disabled {
        cursor: not-allowed;
        opacity: 0.5;
        -webkit-transition: opacity 0.25s;
        transition: opacity 0.25s;
      }
      
      .react-toggle-track {
        width: 50px;
        height: 24px;
        padding: 0;
        border-radius: 30px;
        background-color: #ddd;
        -webkit-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        transition: all 0.2s ease;
      }
      
      .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: #000000;
      }
      
      .react-toggle--checked .react-toggle-track {
        background-color: ${cPrimary};
      }
      
      .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: ${cPrimaryHover};
      }
      
      .react-toggle-track-check {
        position: absolute;
        width: 14px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin-top: auto;
        margin-bottom: auto;
        line-height: 0;
        left: 8px;
        opacity: 0;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }
      
      .react-toggle--checked .react-toggle-track-check {
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }
      
      .react-toggle-track-x {
        position: absolute;
        width: 10px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin-top: auto;
        margin-bottom: auto;
        line-height: 0;
        right: 10px;
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }
      
      .react-toggle--checked .react-toggle-track-x {
        opacity: 0;
      }
      
      .react-toggle-thumb {
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        position: absolute;
        top: 1px;
        left: 1px;
        width: 22px;
        height: 22px;
        border: 1px solid #dddddd;
        border-radius: 50%;
        background-color: #FAFAFA;
      
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      
        -webkit-transition: all 0.25s ease;
        -moz-transition: all 0.25s ease;
        transition: all 0.25s ease;
      }
      
      .react-toggle--checked .react-toggle-thumb {
        left: 27px;
        border-color: ${cPrimary};
      }
      
      .react-toggle--focus .react-toggle-thumb {
        -webkit-box-shadow: 0px 0px 3px 2px ${cPrimaryHover};
        -moz-box-shadow: 0px 0px 3px 2px ${cPrimaryHover};
        box-shadow: 0px 0px 2px 3px ${cPrimaryHover};
      }
      
      .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
        -webkit-box-shadow: 0px 0px 5px 5px ${cPrimaryHover};
        -moz-box-shadow: 0px 0px 5px 5px ${cPrimaryHover};
        box-shadow: 0px 0px 5px 5px ${cPrimaryHover};
      }
`;

export const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

/* DEADCODE:
const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

export const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#f00' : props.index === 1 ? '#ddd' : '${cPrimary}'};
    border-radius: 999px;
`;

export const Track = (props, state) => <StyledTrack {...props} index={state.index} />;
*/

const HeaderSrc = ({ className, children }) => (
    <div className={className}><div>{children}</div></div>
);


HeaderSrc.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
};

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
                <Button onClick={() => confirm()}>OK</Button>
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
        /*
        display: inline-block;
        in-width: 250px;
        ax-width: 250px;
        padding-right:1em;
        */
    }

    input[type=number],
    input[type=checkbox],
    input[type=text] {
        /*width:450px;
        max-width:100%;
        box-sizing: border-box;
        padding:0.3em;*/
    }

    input[type=checkbox] {
        width: auto;
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