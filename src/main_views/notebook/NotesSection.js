import React, { useState, useEffect, useRef } from 'react';
import './NotesSection.css';

function NotesSection(props) {
    const [newNoteValue, setNewNoteValue] = useState('');
    const [noteValues, setNoteValues] = useState({});
    const [autoSave, setAutoSave] = useState(false);
    const timeOfLastChange = useRef(0)
    //const notesToUpdateLog = useRef([]);

    useEffect(() => {
        const notesToSet = [].concat(props.notes);
        setNoteValues(
            //having index as property could be used to determine note order in future
            notesToSet.reduce(
                (notes, note, i) => ({
                    ...notes,
                    [i]: note.contents
                }), {}
            )
        );
    }, [props.notes]);
    useEffect(() => {
        console.log("rerender");
        console.log(timeOfLastChange.current);
        if (timeOfLastChange.current > 0) {
            const saveTimer = setTimeout (save,3000);
            function save () {
                const timeNow = Date.now();
                console.log(typeof timeNow, timeNow, timeOfLastChange.current);
                const timeElapsed = (timeNow - timeOfLastChange.current);
                console.log(timeElapsed);
                if (timeElapsed <= 3000) {
                    console.log("Waiting");
                } else {
                    autoSaveNotes()
                }
            }
        }
    },[noteValues])

    function saveNewNote() {
        props.updateNotes(true, {contents: newNoteValue});
        setNewNoteValue('');
    }

    function handleNoteChange(noteValue, noteIndex) {
        const timeOfChange = Date.now();
        //const n = d.getTime();
        console.log(typeof timeOfChange, timeOfChange);
        timeOfLastChange.current = timeOfChange;
        //Set Note value for state/UI
        const updatedNoteValues = (prev) => ({
            ...prev,
            [noteIndex]: noteValue
        })
        setNoteValues((prevNoteValues) => updatedNoteValues(prevNoteValues))
    }

    function autoSaveNotes() {
        //Function to update database
        const updateDatabase = () => {
                const updateNote = (prevNote, prevNoteIndex) => ({
                    ...prevNote,
                    contents: noteValues[prevNoteIndex]
                })
                const updatedNotes = props.notes.reduce(
                    (notes, note, index) => {
                        notes.push(updateNote(note, index));
                        return notes;
                    }, []
                )
                console.log(updatedNotes);
                props.updateNotes(false, updatedNotes);
                timeOfLastChange.current = 0;
                console.log('saved');
        }
        updateDatabase();
        //Update database if it has been 3 secs since last time the function fired
        //The setTimeout should be to wait for more changes
        //The Interval should resart on each change
        // const saveTimer = setTimeout (save,3000);
        // function save () {
        //     const timeNow = Date.now();
        //     console.log(typeof timeNow, timeNow, timeOfLastChange.current);
        //     const timeElapsed = (timeNow - timeOfLastChange.current);
        //     console.log(timeElapsed);
        //     if (timeElapsed <= 3000) {
        //         console.log("Waiting");
        //     } else {
        //         updateDatabase();
        //     }
        // }
    }

    const makeListOfNoteElements = () => {
        return props.notes.map((note, i) => {
            if (noteValues[i]) {
                return (
                    <Note
                        key={i}
                        value={noteValues[i]}
                        noteIndex={i}
                        handleNoteChange={handleNoteChange}
                    />
                )
            } else {
                return null;
            }
        });
    };
    const noteElements = makeListOfNoteElements();




    return (
        <section
            id='input-notes'
            className='section section-note center scrollspy row'
        >
            <div className='row'>
                <div className='col s12'>
                    <input
                        type='text'
                        className='validate'
                        value={newNoteValue}
                        onChange={(e) => setNewNoteValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                saveNewNote();
                            }
                        }}
                        placeholder={'Add Notes'}
                    />

                    <button
                        id={'add-note-btn-' + props.selectedPlanId}
                        className='btn-floating left button-margin waves-effect waves-light indigo'
                        type='button'
                        onClick={saveNewNote}
                    >
                        <i className='material-icons'>create</i>
                    </button>
                </div>
                <div className='col s12'>
                    {noteElements}
                </div>
            </div>
        </section>
    );
}

function Note(props) {
    return (
        <div className='row'>
            <div className='col s11'>
                <textarea
                    className='readonly'
                    value={props.value}
                    onChange={(e) => props.handleNoteChange(e.target.value, props.noteIndex)}
                />
            </div>
            <div className='col s1'>
                <button
                    className='btn-flat btn-small right waves-effect waves-light'
                    type='button'
                    //onClick={()=>saveChangesToNote(i)}
                >
                    <i className='small material-icons'>more_vert</i>
                </button>
            </div>
        </div>
    );
}

export default NotesSection;
