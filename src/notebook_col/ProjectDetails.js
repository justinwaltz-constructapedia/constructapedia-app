import React , {useState} from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
//import ProjectStepsSection from './ProjectStepsSection.js';

function ProjectDetails (props) {
    return (
        <div className="col s12">
            <div className="nav-wrapper">
                <div className="row blue">
                    <div className="col s12">
                        <h5 className="center-align white-text header">{props.planDraft.title}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <ProjectEditingForm
                    planDraft={props.planDraft}
                    changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                    savePlanChanges={props.savePlanChanges}
                    handleMainAppView={props.handleMainAppView}/>
            </div>
        </div>
    )
}

function ProjectEditingForm (props) {
    const initialNotesValue = (props.planDraft.notes.length > 0)? props.planDraft.notes[0].contents : ""
    const [notesValue, setNotesValue] = useState(props.planDraft.notes.contents);
    const [goalValue, setGoalValue] = useState(props.planDraft.goal);
    const planId = props.planDraft.id;
    function handleChange(event) {
        switch (event.target.id) {
            case "notes_textarea":
                setNotesValue(event.target.value);
                break;
            case "goal_textarea":
                setGoalValue(event.target.value)
                break;
            default:
        }

    }
    function saveSpecificPlanChanges(changeFieldsObject) {
        console.log(changeFieldsObject);
        //may cause problem with differences in planDraft and DB plan?
        props.savePlanChanges(planId, changeFieldsObject, false);
        //props.changeOrUpdatePlanDraft();
    }
    function saveEntirePlan(){
        const changesObj = {
            goal:goalValue,
            notes: [{contents:notesValue}]
        }
        props.savePlanChanges(planId, changesObj, true);
    }

    return (
        <div className="container">
        <div className="row">
            <div className="col s12">
                <div className="row">
                    <div className="input-field col s12">
                        <textarea id="goal_textarea" className="materialize-textarea"  value={goalValue} onChange={handleChange}/>
                        <label htmlFor="notes_textarea">Project Goal</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <textarea id="notes_textarea" className="materialize-textarea"  value={notesValue} onChange={handleChange}/>
                        <label htmlFor="notes_textarea">Project Notes</label>
                    </div>
                </div>
                <div className="row center-align">
                    <button className="btn waves-effect waves-light blue" type="button" onClick={saveEntirePlan}>Save</button>
                </div>
                <div className="divider"></div>
                <div className="row">
                    <SimpleCheckboxSection
                        planDraft={props.planDraft}
                        saveSpecificPlanChanges={saveSpecificPlanChanges}
                        changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                        listType="tools"/>
                    <SimpleCheckboxSection
                        planDraft={props.planDraft}
                        saveSpecificPlanChanges={saveSpecificPlanChanges}
                        changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                        listType="materials"/>
                </div>

                <div className="divider"></div>
                <div className="row">
                {props.planDraft.video_urls.length > 0
                    &&
                    <div className="video-container">
                        <iframe title="video1" src={props.planDraft.video_urls[0]} frameBorder="0" allowFullScreen></iframe>
                    </div>
                }
                </div>
                <div className="row center-align">
                    <button className="btn waves-effect waves-light blue" type="button" name="action" onClick={()=> props.handleMainAppView('SearchResults')}>Add From Other Sites</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ProjectDetails;
/*
<div className="divider"></div>
<ProjectStepsSection planDraft={props.planDraft} changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}/>

const [titleValue, setTitleValue] = useState("");
projectToChange.title = titleValue;
<div className="row">
    <div className="input-field col s12">
        <input id="title_input" type="text" className="validate" value={titleValue} onChange={handleChange} placeholder=""/>
        <label className="active" htmlFor="title_input">Project Title</label>
    </div>
</div>
<div className="divider"></div>
 */
