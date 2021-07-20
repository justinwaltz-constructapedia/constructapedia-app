import React, { useState, useEffect } from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import NotesSection from './NotesSection.js';
import ProjectStepsSection from './ProjectStepsSection.js';
import UrlLinks from './UrlLinks.js';

function ProjectLevel(props) {
    const [selectedLevel, setSelectedLevel] = useState('');
    const videoDisplays = props.userPlans[props.selectedPlanIndex].video_urls.map(
    (url, i) => {
        return (
            <div key={i} className='video-container'>
                <iframe
                    title='video1'
                    src={url}
                    frameBorder='0'
                    allowFullScreen
                ></iframe>
            </div>
        );
    }
  );

    useEffect(() => {
        setSelectedLevel(props.userPlans[props.selectedPlanIndex].id);
    }, [props.userPlans, props.selectedPlanIndex]);

    /*
    function saveNotes (noteValue, noteIndex) {
        //Update for multiple notes in array using noteIndex if necessary
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const currentNotes = props.userPlans[props.selectedPlanIndex].notes
        let updatedNotes;
        if (noteIndex < 0) {
            updatedNotes = currentNotes.concat([{contents:noteValue}])
        }
        props.savePlanChanges(planId, {notes:updatedNotes})
    */
    function saveNotes(noteValue, noteIndex) {
        //Update for multiple notes in array using noteIndex if necessary
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const currentNotes = props.userPlans[props.selectedPlanIndex].notes;
        let updatedNotes;
        if (noteIndex < 0) {
            updatedNotes = currentNotes.concat([{ contents: noteValue }]);
        }
        props.savePlanChanges(planId, { notes: updatedNotes });
    }
    function updateChecklist(checklistIndex, action, itemArr, itemIndex) {
        const currentChecks = [].concat(
            props.userPlans[props.selectedPlanIndex].checks
        );
        console.log(checklistIndex, action, itemArr, itemIndex);
        switch (action) {
            case 'addItem':
                currentChecks[checklistIndex].list.push(itemArr[0]);
                console.log(currentChecks);
                props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {
                  checks: currentChecks,
                });
                break;
            default:
        }
    }

  function updateSubPlan(index, newSubPlanObj) {
    const updatedSubPlans = [].concat(
        props.userPlans[props.selectedPlanIndex].sub_plans
    );
    updatedSubPlans[index] = newSubPlanObj;
    props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {
        sub_plans: updatedSubPlans,
    });
  }

  const checksSections = props.userPlans[props.selectedPlanIndex].checks.map(
    (checkObj, i) => {
        return (
            <form key={checkObj.title + i}>
                <SimpleCheckboxSection
                    checklist={checkObj.list}
                    selectedPlanId={props.userPlans[props.selectedPlanIndex].id}
                    listType={checkObj.list_type}
                    listTitle={checkObj.title}
                    checklistIndex={i}
                    updateChecklist={updateChecklist}
                />
            </form>
        );
    }
  );

  const substepSections = props.userPlans[
    props.selectedPlanIndex
  ].sub_plans.map((subPlan, i) => {
    return (
      <div key={subPlan.title + i} id={subPlan.id} className='row'>
        <div className='nav-wrapper'>
          <div className='row blue lighten-3'>
            <div className='col s12'>
                <h6 className='center-align'>{subPlan.title}</h6>
            </div>
          </div>
        </div>
        <ProjectStepsSection
            subPlan={subPlan}
            subPlanIndex={i}
            updateSubPlan={updateSubPlan}
            planId={props.userPlans[props.selectedPlanIndex].id}
            savePlanChanges={props.savePlanChanges}
        />
      </div>
    );
  });

  return (
    <div className='col s12'>
      <div className='row'>
        <ul className='collection with-header'>
            <li
                id={props.userPlans[props.selectedPlanIndex].id}
                className='collection-header indigo-text center'
            >
                <b>{props.userPlans[props.selectedPlanIndex].title}</b>
            </li>
            <div className='row'>
                {props.userPlans[props.selectedPlanIndex].video_urls.length > 0 &&
                    videoDisplays}
            </div>
            <UrlLinks
                    planId={props.userPlans[props.selectedPlanIndex].id}
                    savePlanChanges = {props.savePlanChanges}
                    videoUrls = {props.userPlans[props.selectedPlanIndex].video_urls}/>
            <li className='collection-item'>
                <NotesSection
                    saveNotes={saveNotes}
                    notes={props.userPlans[props.selectedPlanIndex].notes}
                    selectedPlanId={props.userPlans[props.selectedPlanIndex].id}
                />
            </li>
            <li className='collection-item'>
                <div className='row'>
                    {props.userPlans[props.selectedPlanIndex].checks.length > 0 && checksSections}
                </div>
            </li>
            <li className='collection-item'>{substepSections}</li>
        </ul>
      </div>
    </div>
  );
}

export default ProjectLevel;
