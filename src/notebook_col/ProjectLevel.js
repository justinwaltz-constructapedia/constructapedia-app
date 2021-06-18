import React , {useState} from 'react';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import NotesSection from './NotesSection.js';

function ProjectLevel (props) {
    const [videoUrlValue,setVideoUrlValue] = useState("");
    const videoDisplays = props.userPlans[props.selectedPlanIndex].video_urls.map((url,i) => {
        return(
            <div key={i} className="video-container">
                <iframe title="video1" src={url} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    })

//does this need to be a separate function?

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
                    setVideoUrlValue("");
                }
                break;
            default:
        }
    }

    function saveNotes (noteIndex, noteValue) {
        //Update for multiple notes in array using noteIndex if necessary
        const planId = props.userPlans[props.selectedPlanIndex].id;
        props.savePlanChanges(planId, {notes:[{contents:noteValue}]})
    }
    return (
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

                </div>
            </div>
        </div>
    )
}

export default ProjectLevel;
