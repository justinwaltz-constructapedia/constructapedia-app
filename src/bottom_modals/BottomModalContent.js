import React from 'react';
import WebpageViewer from './WebpageViewer.js';
function BottomModalContent (props) {

    return (
        <div className="modal-content">
            <div className="row">
                <h4 className="col s11">{props.heading}</h4>
                <button className="modal-close waves-effect waves-green btn-flat col s1 blue-grey darken-4 blue-grey-text text-lighten-5">Close</button>
            </div>
            <WebpageViewer header={props.header} urlToView={props.urlToView}/>
        </div>
    )
}

export default BottomModalContent
