import React, { useState, useEffect } from 'react';
import './NotesSection.css';

function NotesSection(props) {
  const initialNotes = props.notes;
  const [newNoteValue, setNewNoteValue] = useState('');
  const [noteValues, setNoteValues] = useState(initialNotes);

  useEffect(() => {
    setNoteValues(props.notes);
  }, [props.notes]);

  function saveChangesToNote(i) {
    console.log(i);
    //props.saveNotes(noteValues[i], i)
  }

  const createNoteElement = (note, i) => (
    <Note
      key={note.contents + i}
      value={note.contents}
      noteIndex={i}
      changeValue={setNewNoteValue}
    />
  );

  const createNotes = () =>
    props.notes.map((note, i) => {
      return createNoteElement(note, i);
    });

  function saveNewNote() {
    props.saveNotes(newNoteValue, -1);
    setNewNoteValue('');
  }

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
        <div className='col s12'>{createNotes()}</div>
      </div>
    </section>
  );
}

function Note(props) {
  const [noteValue, setNoteValue] = useState('');
  useEffect(() => {
    setNoteValue(props.value);
  }, [props.value]);
  return (
    <div className='row'>
      <div className='col s11'>
        <textarea
          className='readonly'
          value={noteValue}
          onChange={(e) => console.log(e.target.value) /*editNoteValue(e, i)*/}
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
