import React from 'react';
import NotesSection from './NotesSection.js';

function ProjectStepsSection(props) {
  /*
    function handleChange(event) {
        const eventId = event.target.id

    }
*/
  function saveNotes(noteIndex, noteValue) {
    //use spread notation
    const changesObj = props.subPlan;
    console.log(noteIndex, noteValue, changesObj);
    if (changesObj.notes.length > 0) {
      changesObj.notes[noteIndex].contents = noteValue;
    } else {
      changesObj.notes = [{ contents: noteValue }];
    }
    props.updateSubPlan(props.subPlanIndex, changesObj);
  }

  return (
    <div className='col s12'>
      <NotesSection saveNotes={saveNotes} notes={props.subPlan.notes} />
    </div>
  );
}

export default ProjectStepsSection;
