import React, {useState} from 'react';

function WebpageViewer (props) {
    const [notesValue, setNotesValue] = useState("");

    function saveNotes () {
        console.log(notesValue);
    }

    return(
        <>
        <div id="webpage_viewer" className="video-container">
            <iframe src={props.urlToView} title="Result Wepage View">{props.urlToView}</iframe>
        </div>
        <div className="divider"></div>
        <div id="notes_section" className="row">
            <form className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5" onSubmit={(e)=> {
                    e.preventDefault();
                    saveNotes(notesValue);
                }}>
                <div className="row section">
                    <div className="input-field col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
                        <i className="material-icons prefix">mode_edit</i>
                        <textarea id="display_notes" className="materialize-textarea" value={notesValue} onChange={(e)=> setNotesValue(e.target.value)}></textarea>
                        <label htmlFor="display_notes">Notes</label>
                    </div>
                </div>
                <button className="btn waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5" type="submit" name="action">Save Project Notes</button>
            </form>
        </div>
        </>
    )
}

export default WebpageViewer;
