import React from "react";
import PropTypes from "prop-types";

import { FileListing } from "./FileListing";  


export function FilePage(props) {

    return <><h2>File Manager</h2><FileListing API={props.API} /></>;
    
}

FilePage.propTypes = {
    API: PropTypes.string,
};

