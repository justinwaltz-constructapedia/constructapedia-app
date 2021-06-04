import React , {useState, useEffect, useRef} from 'react';
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
                        <h5 className="center-align white-text header">{props.userPlans[props.selectedPlanIndex].title}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <ProjectEditingForm
                    userPlans={props.userPlans}
                    selectedPlanIndex={props.selectedPlanIndex}
                    changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                    savePlanChanges={props.savePlanChanges}
                    handleMainAppView={props.handleMainAppView}/>
            </div>
        </div>
    )
}

function ProjectEditingForm (props) {
    const [notesValue, setNotesValue] = useState("");
    //const [goalValue, setGoalValue] = useState(props.planDraft.goal);
    const [videoUrlValue,setVideoUrlValue] = useState("");
    const addMenuDropdown = useRef(null);

    const videoDisplays = props.userPlans[props.selectedPlanIndex].video_urls.map((url,i) => {
        return(
            <div key={i} className="video-container">
                <iframe title="video1" src={url} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    })
    useEffect(() => {
        if (props.userPlans[props.selectedPlanIndex].notes.length > 0){
            setNotesValue(props.userPlans[props.selectedPlanIndex].notes[0].contents)
        }
    },[props.userPlans, props.selectedPlanIndex])

    useEffect(() => {
        M.updateTextFields();
        M.Collapsible.init(addMenuDropdown.current);
    }, [])
//does this need to be a separate function?
    function handleChange(event) {
        switch (event.target.id) {
            case "notes_textarea":
                setNotesValue(event.target.value);
                break;
            /*
            case "goal_textarea":
                setGoalValue(event.target.value)
                break;
            */
            default:

        }

    }
    function addNewItem (itemBtnID) {
        console.log(itemBtnID)
        switch (itemBtnID) {
            case "add-video-btn":
            console.log(videoUrlValue)
                if (videoUrlValue.trim().length > 0) {
                    //Should I be mutating props like this?
                    const planId = props.userPlans[props.selectedPlanIndex].id;
                    const updatedPlanVideoUrls = props.userPlans[props.selectedPlanIndex].video_urls.push(videoUrlValue);
                    console.log(updatedPlanVideoUrls);
                    props.savePlanChanges(planId, {video_urls:updatedPlanVideoUrls})
                }
                break;
            default:
        }
        setVideoUrlValue("");
    }

    function saveEntirePlan(){
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const changesObj = {
            //goal:goalValue,
            notes: [{contents:notesValue}]
        }
        props.savePlanChanges(planId, changesObj);
    }
    function addSubstep(){
        console.log("substep")
    }
    return (
        <div className="row">
                <div className="col s9 offset-s1">
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
                            userPlans={props.userPlans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            savePlanChanges={props.savePlanChanges}
                            listType="tools"/>
                        <SimpleCheckboxSection
                            userPlans={props.userPlans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            savePlanChanges={props.savePlanChanges}
                            listType="materials"/>
                    </div>
                    <div className="divider"></div>
                    <div className="row">
                        {props.userPlans[props.selectedPlanIndex].video_urls.length > 0 && videoDisplays}
                    </div>
                    <div className= "row">
                        <button id="add-video-btn"
                                onClick={(e)=>addNewItem(e.currentTarget.id)}
                                className="btn-floating btn-small waves-effect waves-light blue"
                                type="button">
                            <i className="material-icons">add</i>
                        </button>
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
                        <button className="btn waves-effect waves-light blue" type="button" name="action"
                                onClick={()=> props.handleMainAppView('SearchResults')}>
                                Import From Other Sites
                        </button>
                    </div>
                </div>
                <div className="col s2 center-align">
                    <h5 className="center-align">Add Menu</h5>
                    <div className="divider"></div>
                    <div className="row">
                        <a className="waves-effect waves-blue btn-flat valign-wrapper">
                            Substep<i className="material-icons right">add</i>
                        </a>
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

<div className="row">
    <div className="input-field col s12">
        <textarea id="goal_textarea"
            className="materialize-textarea"
            value={goalValue}
            onChange={handleChange}/>
        <label htmlFor="notes_textarea">Project Goal</label>
    </div>
</div>

<div className="col s11">
    <ul ref={addMenuDropdown} className="collapsible">
        <li>
            <div className="collapsible-header">Substep<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body">
                <span>Lorem ipsum dolor sit amet.</span>
                <button className="btn-floating waves-effect waves-light blue" type="button" name="action"
                        onClick={addSubstep}><i className="material-icons">add</i></button>
            </div>
        </li>
        <li>
            <div className="collapsible-header">Tools List<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span>
                <i className="material-icons">add_circle</i>
            </div>
        </li>
        <li>
            <div className="collapsible-header">Materials List<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
    </ul>
</div>

*/
