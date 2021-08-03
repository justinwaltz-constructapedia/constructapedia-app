import React, {useState} from 'react';
import SearchResults from './SearchResults.js';
//import {getSearchResults} from '../api/searchApi.js';
//import {googleSearch} from '../api/searchApi.js';
function NewProject(props){
    const [planTitleValue, setPlanTitleValue] = useState('');

    async function createNewPlan (importedPlan) {
        let newPlanObj = {}
        if (importedPlan || planTitleValue.trim().length > 0) {
            if (planTitleValue.trim().length > 0) {
                newPlanObj.title = planTitleValue;
            } else {
                newPlanObj.title = importedPlan.title
            }
            const newPlanId = await props.addUserPlan(newPlanObj);
            console.log(`newPlanId: ${newPlanId}
                        importedPlan: ${importedPlan}
                        newPlanObj: ${newPlanObj}`)
            if (importedPlan) {
                delete importedPlan.title;
                console.log(`After Delete...
                            importedPlan: ${importedPlan}
                            newPlanObj: ${newPlanObj}`)
                for (let key in importedPlan) {
                    if (importedPlan.hasOwnProperty(key)) {
                        const object = importedPlan[key]
                        for (let objKey in object) {
                            object[objKey].parent = newPlanId;
                        }
                    }
                }
                const updatedPlanObj = importedPlan;
                console.log(updatedPlanObj);
                const response = await props.savePlanChanges(newPlanId,updatedPlanObj);
                console.log(response);
                if (response === 1) {
                    props.handleMainAppView('ProjectDetails');
                }
            }
        } else {
            alert("Enter a title and/or search term");
        }
    }

    return(
        <div>
            <div className="row">
                <button type="button" className="waves-effect waves-light btn-flat indigo white-text" onClick={()=>{props.handleMainAppView('HomePage')}}><i className="material-icons left">arrow_back</i></button>
            </div>
            <div className="row">
                <h5 className="center-align">Hold My Beer</h5>
                <div className="input-field col s12" >
                    <input className="" id="new_title_input" type="text" value={planTitleValue} onChange={(e)=> setPlanTitleValue(e.target.value)} />
                    <label htmlFor="new_title_input">Project Title</label>
                </div>
            </div>
            <div className="section center-align">
                <button onClick={()=> createNewPlan(false)} className="btn-small waves-effect waves-light indigo" type="button">Create A Project<i className="material-icons left">add</i></button>
            </div>
            <h6 className="center-align">OR</h6>
            <div/>
            <h5 className="center-align">Do a Little Research</h5>
            <SearchResults
                mainAppView={props.mainAppView}
                results={props.results}
                handleScrapedData={createNewPlan}
                placeholder={"Find a Project"}
            />
        </div>
    )
}

export default NewProject;
/*
const [planGoalValue, setPlanGoalValue] = useState('');
const [isSubstepsOn, setIsSubStepsOn] = useState(true)

<div className="row">
    <div className="input-field col s12">
        <textarea placeholder="(Optional)" id="textarea1" className="materialize-textarea" onChange={(e)=> setPlanGoalValue(e.target.value)}></textarea>
        <label htmlFor="textarea1" className="active">Project Goal</label>
    </div>
</div>
<div className="row">
    <div className="container">
        <p>Will your project have substeps or just a single list of actions? (You can change this later)</p>
    </div>
    <div className="switch center-align">
        {
            //Add substeps to DB and settings button to plan list to change or delete settings info
        }
        <label>
            Actions
            <input disabled checked type="checkbox"  onChange={(e)=> setIsSubStepsOn(e.target.value)} />
            <span className="lever"></span>
            Substeps
         </label>
    </div>
</div>*/
