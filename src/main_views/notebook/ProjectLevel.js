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
                    //Should props be mutated like this?
                    const updatedPlanVideoUrls = props.userPlans[props.selectedPlanIndex].video_urls.push(videoUrlValue);
                    console.log(updatedPlanVideoUrls);
                    props.savePlanChanges(planId, {video_urls:updatedPlanVideoUrls})
                    setVideoUrlValue("");
                }
                break;
            default:
        }
    }

    function saveNotes (noteValue, noteIndex) {
        //Update for multiple notes in array using noteIndex if necessary
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const currentNotes = props.userPlans[props.selectedPlanIndex].notes
        let updatedNotes;
        if (noteIndex < 0) {
            updatedNotes = currentNotes.concat([{contents:noteValue}])
        }
        props.savePlanChanges(planId, {notes:updatedNotes})
    }
    function updateChecklist (checklistIndex, action, itemArr, itemIndex) {
        const currentChecks = [].concat(props.userPlans[props.selectedPlanIndex].checks)
        console.log(checklistIndex, action, itemArr, itemIndex);
        switch (action) {
            case "addItem":
                currentChecks[checklistIndex].list.push(itemArr[0]);
                console.log(currentChecks);
                props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {checks:currentChecks})
                break;
            default:

        }
    }

    const checksSections = props.userPlans[props.selectedPlanIndex].checks.map((checkObj,i) => {
        return (
            <form key={checkObj.title+i} >
                <SimpleCheckboxSection
                    checklist={checkObj.list}
                    selectedPlanId={props.userPlans[props.selectedPlanIndex].id}
                    listType={checkObj.list_type}
                    listTitle={checkObj.title}
                    checklistIndex={i}
                    updateChecklist={updateChecklist}
                    />
            </form>
        )
    })
    return (
        <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="divider"></div>
            <NotesSection saveNotes={saveNotes}
                        notes={props.userPlans[props.selectedPlanIndex].notes}
                        selectedPlanId={props.userPlans[props.selectedPlanIndex].id}
                        />
            <div className="divider"></div>
            <div className="row">
                { props.userPlans[props.selectedPlanIndex].checks.length > 0 && checksSections }
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
