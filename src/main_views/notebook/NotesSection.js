import React, { useState, useEffect, useRef, useContext } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './NotesSection.css';
import { putPlanUpdate } from '../../api/projectsApi.js';
import { PlanContext } from '../../PlanContext.js';

function NotesSection(props) {
    const [newNoteValue, setNewNoteValue] = useState('');
    const [noteValues, setNoteValues] = useState({});
    const timeOfLastChange = useRef(0);
    // const [tinyTextValue, setTinyTextValue] = useState("<p>Project Purpose</p>");
    const editorRef = useRef(null);
    const [dirty, setDirty] = useState(false);
    const [contextState, contextDispatch] = useContext(PlanContext);
    const { selectedSowId } = contextState;

    useEffect(() => setDirty(false), [props.solution]);
    useEffect(() => {
        const notesToSet = [].concat(props.notes);
        setNoteValues(
            //having index as property could be used to determine note order in future
            notesToSet.reduce(
                (notes, note, i) => ({
                    ...notes,
                    [i]: note.contents,
                }),
                {}
            )
        );
    }, [props.notes]);

    useEffect(() => {
        //Update database if it has been 3 secs since last time the function fired
        //Function to update database
        //Could be abstracted & extracted for other autosaves (maybe a custom hook?)
        const updateDatabase = () => {
            const updateNote = (prevNote, prevNoteIndex) => ({
                ...prevNote,
                contents: noteValues[prevNoteIndex],
            });
            const updatedNotes = props.notes.reduce((notes, note, index) => {
                notes.push(updateNote(note, index));
                return notes;
            }, []);
            props.updateNotes(false, updatedNotes);
            timeOfLastChange.current = 0;
            console.log('saved');
        };
        if (timeOfLastChange.current > 0) {
            function save() {
                const timeNow = Date.now();
                const timeElapsed = timeNow - timeOfLastChange.current;
                console.log(timeElapsed);
                if (timeElapsed <= 3000) {
                    console.log('Waiting');
                } else {
                    updateDatabase();
                }
            }
            //The setTimeout is to check if more changes have occured by evaluating the timeOfLastChange ref
            setTimeout(save, 3000);
        }
    }, [noteValues, props]);

    const saveEditor = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            setDirty(false);
            editorRef.current.setDirty(false);
            // an application would save the editor content to the server here
            console.log(typeof content, content);
            putPlanUpdate(selectedSowId, {solution: content})
        }
    };

    function saveNewNote() {
        props.updateNotes(true, { contents: newNoteValue });
        setNewNoteValue('');
    }
    const handleEditorChange = (e) => {
        const newContent = e.target.getContent()
        console.log(
            'Content was updated:',
            newContent
        );
        // setTinyTextValue(newContent);
    }
    function handleNoteChange(noteValue, noteIndex) {
        const timeOfChange = Date.now();
        timeOfLastChange.current = timeOfChange;
        //Set Note value for state/UI
        const updatedNoteValues = (prev) => ({
            ...prev,
            [noteIndex]: noteValue,
        });
        setNoteValues((prevNoteValues) => updatedNoteValues(prevNoteValues));
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
                );
            } else {
                return null;
            }
        });
    };
    const noteElements = makeListOfNoteElements();

    return (
        <section id='input-notes' className='section section-note row'>
            <div className='row'>
            <Editor
                initialValue={(props.solution)? props.solution : "<p>Project Purpose</p>"}
                onInit={(evt, editor) => editorRef.current = editor}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image',
                        'charmap print preview anchor help',
                        'searchreplace visualblocks code',
                        'insertdatetime media table paste wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic | \
                        alignleft aligncenter alignright | \
                        bullist numlist outdent indent | help'
                    }}
                onChange={handleEditorChange}
                onDirty={() => setDirty(true)}
            />
            <button className='btn' onClick={saveEditor} disabled={!dirty}>Save</button>
            {dirty && <p>You have unsaved content!</p>}
            </div>
            <div className='row'>
                <div className='col s12'>
                    <div className='input-field inline'>
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
                            placeholder={'Quick Note'}
                        />
                    </div>
                    <button
                        id={'add-note-btn-' + props.selectedPlanId}
                        className='btn-small waves-effect waves-light indigo'
                        type='button'
                        onClick={saveNewNote}
                    >
                        <i className='material-icons'>create</i>
                    </button>
                </div>
                <div className='col s12'>{noteElements}</div>
            </div>
        </section>
    );
}

function Note(props) {
    return (
        <div className='row'>
            <div className='col s11'>
                {/*<textarea
                    className='readonly'
                    value={props.value}
                    onChange={(e) =>
                        props.handleNoteChange(e.target.value, props.noteIndex)
                    }
                />*/}
                <p>{props.value}</p>
            </div>
            <div className='col s1'>
                <button
                    className='btn-flat right waves-effect waves-light'
                    type='button'
                    onClick={() => {
                            console.log('Delete not implemented');
                        }
                    }
                >
                    <i className='material-icons indigo-text text-lighten-5'>
                        close
                    </i>
                </button>
            </div>
        </div>
    );
}

export default NotesSection;
