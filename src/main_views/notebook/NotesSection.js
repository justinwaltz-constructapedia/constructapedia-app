import React, {useState} from 'react';

function NotesSection (props) {
    const initialNotesValues = (props.notes.length > 0) ? props.notes : [""];
    const [notesValue, setNotesValue] = useState(initialNotesValues[0].contents);

    return (
        <div className="row">
            <div className="input-field col s12 ">
                <h5>Note Pad</h5>
                <textarea id="notes_textarea"
                    className="materialize-textarea blue-grey darken-4 blue-grey-text text-lighten-5"
                    value={notesValue}
                    onChange={(e)=>setNotesValue(e.target.value)}
                    />
                <button className="btn-floating waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5 left" type="button" onClick={()=>props.saveNotes(0, notesValue)}><i className="material-icons">save</i></button>
            </div>
        </div>
    )
}

export default NotesSection;
//onKeyDown={(e)=>{if(e.keyCode===13){saveEntirePlan()}}}
