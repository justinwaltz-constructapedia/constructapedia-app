import React from 'react';
import WebpageViewer from './WebpageViewer.js';
function BottomModalContent (props) {

    return (
        <div className="modal-content blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <h4 className="col s11 blue-grey darken-4 blue-grey-text text-lighten-5">{props.heading}</h4>
                <button className="modal-close waves-effect waves-green btn-flat col s1 blue-grey darken-4 blue-grey-text text-lighten-5">Close</button>
            </div>
            <WebpageViewer header={props.header} urlToView={props.urlToView}/>
        </div>
    )
}

export default BottomModalContent
