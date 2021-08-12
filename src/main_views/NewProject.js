import React, { useState } from 'react';
import SearchResults from './SearchResults.js';
//import {getSearchResults} from '../api/searchApi.js';
//import {googleSearch} from '../api/searchApi.js';
function NewProject(props) {
    const [planTitleValue, setPlanTitleValue] = useState('');

    async function createNewPlan(importedPlan) {
        let newPlanObj = {};
        if (importedPlan || planTitleValue.trim().length > 0) {
            if (planTitleValue.trim().length > 0) {
                newPlanObj.title = planTitleValue;
            } else {
                newPlanObj.title = importedPlan.title;
            }
            const newPlanId = await props.addUserPlan(newPlanObj);
            console.log(`newPlanId: ${newPlanId}
                        importedPlan: ${importedPlan}
                        newPlanObj: ${newPlanObj}`);
            if (importedPlan) {
                delete importedPlan.title;
                console.log(`After Delete...
                            importedPlan: ${importedPlan}
                            newPlanObj: ${newPlanObj}`);
                for (let key in importedPlan) {
                    if (importedPlan.hasOwnProperty(key)) {
                        const object = importedPlan[key];
                        if (key === 'checks' || key === 'sub_plans') {
                            for (let objKey in object) {
                                object[objKey].parent = newPlanId;
                            }
                        }
                    }
                }
                const updatedPlanObj = importedPlan;
                console.log(updatedPlanObj);
                const response = await props.savePlanChanges(
                    newPlanId,
                    updatedPlanObj
                );
                console.log(response);
                if (response === 1) {
                    props.handleMainAppView('ProjectDetails');
                }
            }
        } else {
            alert('Enter a title and/or search term');
        }
    }

    return (
        <ul className='collection with-header'>
            <div className=''>
                <button
                    type='button'
                    className='waves-effect waves-light btn-flat indigo-text'
                    onClick={() => {
                        props.handleMainAppView('HomePage');
                    }}
                >
                    <i className='material-icons left'>arrow_back</i>
                </button>
            </div>

            <li className='collection-header indigo-text'>
                Start Working Your Project
            </li>
            <li className='collection-item'>
                <div className='input-field inline'>
                    <input
                        className=''
                        id='new_title_input'
                        type='text'
                        value={planTitleValue}
                        onChange={(e) => setPlanTitleValue(e.target.value)}
                        placeholder={'Input Project Title'}
                    />
                </div>

                <button
                    onClick={() => createNewPlan(false)}
                    className='btn-small waves-effect waves-light indigo'
                    type='button'
                >
                    <i className='material-icons'>add</i>
                </button>
            </li>

            <li className='collection-header indigo-text'>
                Do a Little Research First
            </li>
            <li className='collection-item'>
                <SearchResults
                    mainAppView={props.mainAppView}
                    results={props.results}
                    handleScrapedData={createNewPlan}
                    placeholder={'Constructapedia'}
                />
            </li>
        </ul>
    );
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
