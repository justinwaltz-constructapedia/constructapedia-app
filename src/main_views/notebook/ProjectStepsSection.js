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
        props.updateSubPlan(props.selectedSubPlanIndex, changesObj);
    }

    return (
        <div className='col s12 black-text'>
            <NotesSection saveNotes={saveNotes} notes={props.subPlan.notes} />
            <section id='input-notes' className='section center row'>
                <button
                    className='btn-flat right waves-effect waves-light grey-text text-lighten-3'
                    type='button'
                    onClick={() => props.deleteItemInPlan('sub_plans', props.subPlanIndex)}
                >
                    <i className='material-icons right'>delete_forever</i>
                </button>
            </section>
        </div>
    );
}

export default ProjectStepsSection;
