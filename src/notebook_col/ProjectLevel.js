import React , {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import NotesSection from './NotesSection.js';

function ProjectLevel (props) {
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
        const eventId = event.target.id
        switch (eventId) {
            case "new_substep":
                setAddModalValue(event.target.value);
                break;
            default:
                return;
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
    function saveNotes (noteIndex, noteValue) {
        //Update for multiple notes in array using noteIndex if necessary
        const planId = props.userPlans[props.selectedPlanIndex].id;
        props.savePlanChanges(planId, {notes:[{contents:noteValue}]})
    }
    return (
        <div>
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <div className="col s9 offset-s1 blue-grey darken-4 blue-grey-text text-lighten-5">
                    <div className="divider"></div>
                    <NotesSection saveNotes={saveNotes} notes={props.userPlans[props.selectedPlanIndex].notes}/>
                    <div className="divider"></div>
                    <div className="row">
                        <form>
                        <SimpleCheckboxSection
                            userPlans={props.userPlans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            savePlanChanges={props.savePlanChanges}
                            listType="tools"/>
                        </form>
                        <form>
                        <SimpleCheckboxSection
                            userPlans={props.userPlans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            savePlanChanges={props.savePlanChanges}
                            listType="materials"/>
                        </form>
                    </div>
                    <div className="divider"></div>
                    <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                        {props.userPlans[props.selectedPlanIndex].video_urls.length > 0 && videoDisplays}
                    </div>
                    <div className= "row blue-grey darken-4 blue-grey-text text-lighten-5">
                        <button id="add-video-btn"
                                onClick={(e)=>addNewItem(e.currentTarget.id)}
                                className="btn-floating btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5"
                                type="button">
                            <i className="material-icons">add</i>
                        </button>
                        <div className="input-field inline blue-grey darken-4 blue-grey-text text-lighten-5">
                            <input id="new_video"
                                type="text"
                                className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                                value={videoUrlValue}
                                placeholder="Video website address (URL)"
                                onChange={(e) => setVideoUrlValue(e.target.value)}/>
                            <label htmlFor="new_video">Add New Video</label>
                        </div>
                    </div>
                </div>
                <div className="col s2 center-align">
                    <h5 className="center-align"><b>&#123;C&#125;</b></h5>

                    <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                        <a id="add-substep-btn" href="#add-modal"
                            className="waves-effect waves-blue btn valign-wrapper blue-grey darken-3 blue-grey-text text-lighten-5"
                            onClick={(e)=> openAddModal(e)}>
                            Work Step<i className="material-icons left">add</i>
                        </a>
                    </div>
                </div>
            </div>
            <div ref={addModal} id={"add-modal"+props.userPlans[props.selectedPlanIndex].title} className="modal">
                <div className="modal-content">
                    <h4>{addModalTitle}</h4>
                    <div className="input-field">
                        <input type="text" placeholder="Title"
                                id={"new_"+addModalType}
                                className="validate"
                                value={addModalValue}
                                onChange={(e) => handleChange(e)}/>
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
