import React , {useState, useEffect} from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
//import ProjectStepsSection from './ProjectStepsSection.js';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

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
    const [notesValue, setNotesValue] = useState(initialNotesValue);
    const [goalValue, setGoalValue] = useState(props.planDraft.goal);
    const [videoUrlValue,setVideoUrlValue] = useState("");
    const planId = props.planDraft.id;

    const videoDisplays = props.planDraft.video_urls.map((url,i) => {
        return(
            <div key={i} className="video-container">
                <iframe title="video1" src={url} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    })
    useEffect(() => {
        M.updateTextFields();
    })
//does this need to be a separate function?
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
    function addNewItem (itemBtnID) {
        console.log(itemBtnID)
        const newPlanDraft = props.planDraft;
        switch (itemBtnID) {
            case "add-video-btn":
            console.log(videoUrlValue)
                if (videoUrlValue.trim().length > 0) {
                    newPlanDraft.video_urls.push(videoUrlValue);
                    saveSpecificPlanChanges({video_urls:newPlanDraft.video_urls})
                }
                break;
            default:
        }
        console.log(newPlanDraft)
        props.changeOrUpdatePlanDraft(newPlanDraft);
        setVideoUrlValue("");
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
                        <textarea id="goal_textarea"
                            className="materialize-textarea"
                            value={goalValue}
                            onChange={handleChange}/>
                        <label htmlFor="notes_textarea">Project Goal</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <textarea id="notes_textarea"
                            className="materialize-textarea"
                            value={notesValue}
                            onChange={handleChange}/>
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
                    {props.planDraft.video_urls.length > 0 && videoDisplays}
                </div>
                <div className= "row">
                    <button id="add-video-btn" onClick={(e)=>addNewItem(e.currentTarget.id)} className="btn-floating btn-small waves-effect waves-light blue" type="button"><i className="material-icons">add</i></button>
                    <div className="input-field inline">
                        <input id="new_video"
                            type="text"
                            className="validate"
                            value={videoUrlValue}
                            placeholder="Video website address (URL)"
                            onChange={(e) => setVideoUrlValue(e.target.value)}/>
                        <label htmlFor="new_video">Add New Video</label>
                    </div>
                </div>
                <div className="row center-align">
                    <button className="btn waves-effect waves-light blue" type="button" name="action" onClick={()=> props.handleMainAppView('SearchResults')}>Import From Other Sites</button>
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
