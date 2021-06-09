import React , {useState, useEffect, useRef} from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function ProjectLevel (props) {
    const [notesValue, setNotesValue] = useState("");
    //const [goalValue, setGoalValue] = useState(props.planDraft.goal);
    const [videoUrlValue,setVideoUrlValue] = useState("");
    const addMenuDropdown = useRef(null);
    const addModal = useRef(null);
    const [addModalTitle, setAddModalTitle] = useState("");
    const [addModalType, setAddModalType] = useState("");
    const[addModalValue, setAddModalValue] = useState("");

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
        M.updateTextFields();
    },[props.userPlans, props.selectedPlanIndex])

    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true
        }
        M.Collapsible.init(addMenuDropdown.current);
        M.Modal.init(addModal.current, addModalOptions);
    }, [])
//does this need to be a separate function?
    function handleChange(event) {
        switch (event.target.id) {
            case "notes_textarea":
                setNotesValue(event.target.value);
                break;
            case "new_substep":
                setAddModalValue(event.target.value);
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
        console.log(itemBtnID);
        const planId = props.userPlans[props.selectedPlanIndex].id;
        switch (itemBtnID) {
            case "add-video-btn":
                console.log(videoUrlValue)
                if (videoUrlValue.trim().length > 0) {
                    //Should I be mutating props like this?
                    const updatedPlanVideoUrls = props.userPlans[props.selectedPlanIndex].video_urls.push(videoUrlValue);
                    console.log(updatedPlanVideoUrls);
                    props.savePlanChanges(planId, {video_urls:updatedPlanVideoUrls})
                }
                break;
            case "addModal-add-btn":
                if (addModalType === "substep" && addModalValue.trim().length > 0){
                    console.log(addModalValue);
                    const updatedPlanSubsteps = [].concat(props.userPlans[props.selectedPlanIndex].sub_plans)
                    updatedPlanSubsteps.push({title:addModalValue})
                    console.log(updatedPlanSubsteps);
                    props.savePlanChanges(planId, {sub_plans:updatedPlanSubsteps})
                }
                break;
            default:
        }
        setVideoUrlValue("");
    }

    function openAddModal(e){
        console.log(e.target.id)
        const addModalInstance = M.Modal.getInstance(addModal.current)
        if (e.target.id === "add-substep-btn"){
            setAddModalTitle("Add New Substep");
            setAddModalType("substep");
            addModalInstance.open();
        }
    }

    function saveEntirePlan(){
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const changesObj = {
            //goal:goalValue,
            notes: [{contents:notesValue}]
        }
        props.savePlanChanges(planId, changesObj);
    }

    return (
        <div>
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
                </div>
                <div className="col s2 center-align">
                    <h5 className="center-align">Add Menu</h5>
                    <div className="divider"></div>
                    <div className="row">
                        <a id="add-substep-btn" href="#add-modal"
                            className="waves-effect waves-blue btn-flat valign-wrapper"
                            onClick={(e)=> openAddModal(e)}>
                            Substep<i className="material-icons right">add</i>
                        </a>
                    </div>
                </div>
            </div>
            <div ref={addModal} id={"add-modal"+props.userPlans[props.selectedPlanIndex].title} className="modal">
                <div className="modal-content">
                    <h4>{addModalTitle}</h4>
                    <div className="input-field">
                        <input id={"new_"+props.userPlans[props.selectedPlanIndex].title+addModalType} type="text" className="validate" value={addModalValue} onChange={(e) => handleChange(e)}/>
                        <label htmlFor={"new_" + addModalType}>Name</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <a id="addModal-add-btn" href="#projectDetails"
                        className="modal-close waves-effect waves-blue btn-flat"
                        onClick={(e) => addNewItem(e.target.id)}>
                        Add
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProjectLevel;