import React, { useState, useEffect } from 'react';

function NotesSection (props) {
    const initialNoteValues = props.notes
    const [newNoteValue, setNewNoteValue] = useState("");
    const [noteValues, setNoteValues] = useState(initialNoteValues);

    function saveChangesToNote (i) {
        console.log(i);
        //props.saveNotes(noteValues[i], i)
    }

    const createNoteElement = (note, i) => (
        <div key={note.contents + i} className="row">
            <div className= "col s10 input-field">
                <textarea
                    className="materialize-textarea blue-grey darken-4 blue-grey-text text-lighten-5"
                    value={note.contents}
                    onChange={(e) => console.log(e.target.value)/*editNoteValue(e, i)*/}
                    />
            </div>
            <div className= "col s2">
                <button className="btn-floating waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5 left"
                        type="button"
                        //onClick={()=>saveChangesToNote(i)}
                        >
                    <i className="material-icons">save</i>
                </button>
            </div>
        </div>
    )

    const createNotes = () => props.notes.map(createNoteElement)

    return (
        <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
                <h5>Note Pad</h5>
                {createNotes()}
                <div className="row valign-wrapper">
                    <div className="col s1">
                        <button id={"add-note-btn-" + props.selectedPlanId}
                                className="btn-floating btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button"
                                onClick={() => props.saveNotes(newNoteValue, -1)}>
                                <i className="material-icons">add</i>
                        </button>
                    </div>
                    <div className="col s11 input-field blue-grey darken-4 blue-grey-text text-lighten-5">
                        <input type="text" className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                                value={newNoteValue}
                                onChange={(e) => setNewNoteValue(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.keyCode===13){
                                        props.saveNotes(newNoteValue, -1)
                                    }
                                }}
                                placeholder={"Add New Note"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotesSection;
