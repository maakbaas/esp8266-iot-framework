import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Config from '../configuration.json';

import { Form, Button } from './UiComponents'

import { obj2bin, bin2obj } from '../functions/configHelpers'

const Grey = styled.span`
    color:#666;
`;

export function ConfigPage(props) {
    const [state, setState] = useState([]);
    const [binSize, setBinSize] = useState(0);

    useEffect(() => {
        document.title = `Configuration`;
        fetchData();
    }, []);

    function fetchData() {
        fetch(props.API + '/api/config/get')
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                setBinSize(data.byteLength);
                setState(bin2obj(data));
            });
    }

    var confItems;
    if (Config.length==0)
    {
        confItems=<p>There are no items defined in <b>configuration.json</b></p>
    }
    else
    {
        for (var i = 0; i < Config.length; i++) {
            var value; 
            if (typeof state[Config[i].name] !== 'undefined')
                value = state[Config[i].name];
            else
                value = '';
                
            var size;
            if (Config[i].type=='char')
                size = '[' + Config[i].length +']';
            else 
                size = '';

            confItems = <>{confItems}
                <p><label for={Config[i].name}><Grey>{Config[i].type}{size}</Grey>{" "}<b>{Config[i].name}</b>:</label>
                    <input type="text" id={Config[i].name} name={Config[i].name} value={value} />
                </p>
            </>
        }
    }

    var button;
    if (Object.keys(state).length>0)
        button = <Button onClick={() =>
            fetch(props.API + '/api/config/set', {
                method: 'post',
                body: form2bin()                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) 
                        fetchData();
            })         
        }>Save</Button>;

    var form = <><Form>
        {confItems}
    </Form>
    {button}        
    </>

    return <><h2>Configuration</h2><p>{form}</p></>;

    function form2bin()
    {
        var newData = {};

        for (var i = 0; i < Config.length; i++) {

            newData[Config[i].name] = document.getElementById(Config[i].name).value;

        }
        
        return obj2bin(newData, binSize);
        
    }
    
}