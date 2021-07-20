import React, { useState, useEffect } from 'react';

function NotesSection (props) {
    const initialNotes = props.notes
    const [newNoteValue, setNewNoteValue] = useState("");
    const [noteValues, setNoteValues] = useState(initialNotes);

    useEffect(() => {
        setNoteValues(props.notes)
    }, [props.notes])

    function saveChangesToNote (i) {
        console.log(i);
        //props.saveNotes(noteValues[i], i)
    }

    const createNoteElement = (note, i) => (
        <Note
            key={note.contents + i}
            value={note.contents}
            noteIndex={i}
            changeValue={setNewNoteValue}/>
    )

    const createNotes = () => props.notes.map((note, i)=> {
        return createNoteElement(note,i)
    })

    function saveNewNote () {
        props.saveNotes(newNoteValue, -1)
        setNewNoteValue("");
    }

    return (
        <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
                <h5>Note Pad</h5>
                {createNotes()}
                <div className="row valign-wrapper">
                    <div className="col s1">
                        <button id={"add-note-btn-" + props.selectedPlanId}
                                className="btn-floating btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button"
                                onClick={saveNewNote}>
                                <i className="material-icons">add</i>
                        </button>
                    </div>
                    <div className="col s11 input-field blue-grey darken-4 blue-grey-text text-lighten-5">
                        <input type="text" className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                                value={newNoteValue}
                                onChange={(e) => setNewNoteValue(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.keyCode===13){
                                        saveNewNote()
                                    }
                                }}
                                placeholder={"Add New Note"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Note (props) {
    const [noteValue, setNoteValue] = useState("");
    useEffect(() => {
        setNoteValue(props.value);
    }, [props.value])
    return (
        <div className="row">
            <div className= "col s10 input-field">
                <textarea
                    className="materialize-textarea blue-grey darken-4 blue-grey-text text-lighten-5"
                    value={noteValue}
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
}

export default NotesSection;
