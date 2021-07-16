import React, {useState, useRef, useEffect} from 'react';

function NotesSection (props) {
    //const initialNotesValues = (props.notes.length > 0) ? props.notes : [""];
    const [newNoteValue, setNewNoteValue] = useState("");
    const [noteValues, setNoteValues] = useState("");
    const noteAreas = useRef(<div></div>);
    noteAreas.current = makeNotesElements(props.notes);
    useEffect(() => {
        populateNoteValues(props.notes)
    }, [props.notes]);

    function populateNoteValues (notesToSet) {
        if (notesToSet.length > 0) {
            setNoteValues(notesToSet.reduce(
                (options, option, index) => ({
                    ...options,
                    [index]:option.contents
                }),
                {}
            ))
        }
    }

    function makeNotesElements (notesArr) {
        console.log(notesArr);
        if (notesArr.length > 0) {
            return notesArr.map((noteObj, i) => {
                return (
                    <div key={"notes_textarea"+i} className="row">
                        <div className= "col s10 input-field">
                            <textarea
                                className="materialize-textarea blue-grey darken-4 blue-grey-text text-lighten-5"
                                value={noteValues[i]}
                                onChange={(e) => setNoteValues(prevNoteValues => prevNoteValues[i]=e.target.value)}
                                />
                        </div>
                        <div className= "col s2">
                            <button className="btn-floating waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5 left"
                                    type="button"
                                    onClick={()=>props.saveNotes(i, noteValues[i])}>
                                <i className="material-icons">save</i>
                            </button>
                        </div>
                    </div>
                )
            })
        } else {
            return null;
        }
    }

    function addNewNote () {
        props.saveNotes(newNoteValue);
    }
    return (
        <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
                <h5>Note Pad</h5>
                {noteAreas.current}
                <div className="row valign-wrapper">
                    <div className="col s1">
                        <button id={"add-note-btn-" + props.selectedPlanId}
                                className="btn-floating btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button"
                                onClick={addNewNote}>
                                <i className="material-icons">add</i>
                        </button>
                    </div>
                    <div className="col s11 input-field blue-grey darken-4 blue-grey-text text-lighten-5">
                        <input type="text" className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                            value={newNoteValue}
                            onChange={(e) => setNewNoteValue(e.target.value)}
                            onKeyDown={(e)=>{if(e.keyCode===13){addNewNote()}}}
                            placeholder={"Add New Note"}/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NotesSection;
//onKeyDown={(e)=>{if(e.keyCode===13){saveEntirePlan()}}}
//onChange={(e)=>setNotesValue(e.target.value)}
