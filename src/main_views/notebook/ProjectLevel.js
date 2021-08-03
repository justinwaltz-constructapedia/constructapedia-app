import React, { useState, useEffect, useRef } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import NotesSection from './NotesSection.js';
import ProjectStepsSection from './ProjectStepsSection.js';
import UrlLinks from './UrlLinks.js';

function ProjectLevel(props) {

//Ref hook for the substep tabs directly under the project
    const substepTabsUl = useRef(null);
    const collapsibleProject = useRef(null)
//Effect hooks
    //Hook for intializing the substep tab functionality using Materialize
    useEffect(() => {
        if (props.userPlans[props.selectedPlanIndex].sub_plans.length > 0) {
            const tabsOptions = {
                swipeable: true
            }
            M.Tabs.init(substepTabsUl.current, tabsOptions);
        }
    })
    //Initialze Materialize collapsible for main plan level
    useEffect(() => {
        const collapsibleOptions = {accordion: false}
        M.Collapsible.init(collapsibleProject.current, collapsibleOptions);
    })

    // useEffect(() => {
    //     setSelectedLevel(props.userPlans[props.selectedPlanIndex].id);
    // }, [props.userPlans, props.selectedPlanIndex]);

    function updateChecklist(checklistIndex, action, itemArr, itemIndex) {
        const currentChecks = [].concat(props.userPlans[props.selectedPlanIndex].checks)
        console.log(checklistIndex, action, itemArr, itemIndex);
        console.log(currentChecks);
        switch (action) {
            case 'addItem':
                const newChecks = currentChecks.reduce((checks, check, index) => {
                    if (checklistIndex === index) {
                        const newCheckList = currentChecks[checklistIndex].list.concat(itemArr);
                        check.list = newCheckList;
                    }
                    checks.push(check);
                    return checks;
                }, [])
                console.log(newChecks);
                props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {checks: newChecks});
                break;
            case 'updateItem':
                currentChecks[checklistIndex].list = itemArr;
                props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {checks: currentChecks});
                break;
            default:
        }
    }

    function updateNotes (isNewNote, newNoteObj) {
        let updatedNotes;
        if (isNewNote) {
            updatedNotes = [].concat(
                props.userPlans[props.selectedPlanIndex].notes
            );
            updatedNotes.push(newNoteObj);
        } else {
            updatedNotes = newNoteObj;
        }
        props.savePlanChanges(
            props.userPlans[props.selectedPlanIndex].id,
            { notes: updatedNotes }
        )
    }

    function updateSubPlan(index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            props.userPlans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        props.savePlanChanges(
            props.userPlans[props.selectedPlanIndex].id,
            { sub_plans: updatedSubPlans }
        );
    }
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
    });
    const checksSections = props.userPlans[props.selectedPlanIndex].checks.map(
        (checkObj, i) => {
            return (
                <div key={checkObj.title + i} className="row">
                    <SimpleCheckboxSection
                        checklist={checkObj.list}
                        listType={checkObj.list_type}
                        listTitle={checkObj.title}
                        checklistIndex={i}
                        updateChecklist={updateChecklist}
                        deleteItemInPlan={props.deleteItemInPlan}
                    />
                </div>
            );
        }
    );
    // const createSubstepTabs = () => {
    //
    // }
    const substepTabs = props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan, i) => {
        return <li key={subPlan.id} className="tab col s3"><a href={"#"+subPlan.id}>{subPlan.title}</a></li>
    })


    const substepSections = props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan, i) => {
        return (
            <div key={subPlan.title + i} id={subPlan.id} className='col s12'>
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
                    deleteItemInPlan={props.deleteItemInPlan}
                />
            </div>
        );
    });

    return (
        <div className='col s12'>

            <div className='row'>
                <ul ref={collapsibleProject} className='collapsible expandable z-depth-0'>
                    <li
                        id={props.userPlans[props.selectedPlanIndex].id}
                        className='collection-header indigo-text center'
                    >
                        <b>{props.userPlans[props.selectedPlanIndex].title}</b>
                    </li>
                    <li className="active">
                        <h6 className="collapsible-header">Videos</h6>
                        <div className="collapsible-body">
                            <div className='row'>
                                {props.userPlans[props.selectedPlanIndex].video_urls.length > 0 &&
                                    videoDisplays}
                            </div>
                            <UrlLinks
                                planId={props.userPlans[props.selectedPlanIndex].id}
                                savePlanChanges = {props.savePlanChanges}
                                videoUrls = {props.userPlans[props.selectedPlanIndex].video_urls}
                            />
                        </div>
                    </li>
                    <li className="active">
                        <div className="collapsible-header">
                            <h6>Notes</h6>
                        </div>
                        <div className="collapsible-body">
                            <NotesSection
                                updateNotes={updateNotes}
                                notes={props.userPlans[props.selectedPlanIndex].notes}
                                deleteItemInPlan={props.deleteItemInPlan}
                            />
                        </div>
                    </li>
                    <li className="active">
                        <div className="collapsible-header">
                            <h6>Checklists</h6>
                        </div>
                        <div className='collapsible-body'>
                            {props.userPlans[props.selectedPlanIndex].checks.length > 0 && checksSections}
                        </div>
                    </li>
                    <li  className="active">
                        <div className="collapsible-header">
                            <h6>Steps</h6>
                        </div>
                        <div className="collapsible-body">
                            {!props.reload &&
                            (<><ul ref={substepTabsUl} id="substep-tabs-swipe" className="tabs">
                                {substepTabs}
                            </ul>
                            {substepSections}</>)
                            }
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    );
}

export default ProjectLevel;
// <ul>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">filter_drama</i>First</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">place</i>Second</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">whatshot</i>Third</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
// </ul>
