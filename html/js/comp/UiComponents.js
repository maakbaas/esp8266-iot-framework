import styled, { createGlobalStyle, css } from 'styled-components'
import { normalize } from 'styled-normalize'

export const GlobalStyle = createGlobalStyle`
  
    ${normalize}

    body {
        margin:1em;
        font-size:1.2em;
        line-height:1.4em;
    }

    * {
        font-family: Arial;
    }

    a {
        color: #ff00cc;
        text-decoration: none;
    
        &:hover {
            color: #cc0099;
        }
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

export const Submit = styled.input.attrs({
    type: 'submit'
})`
    ${buttonStyle}  
`;