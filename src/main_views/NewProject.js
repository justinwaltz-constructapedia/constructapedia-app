import React, { useState, useContext } from 'react';
import SearchResults from './SearchResults.js';
//Import for useContext
import {PlanContext} from '../PlanContext.js'
//Import DB Api functions
import { postPlan, getUserPlans } from '../api/projectsApi';
//import {getSearchResults} from '../api/searchApi.js';
//import {googleSearch} from '../api/searchApi.js';
function NewProject(props) {
    //useContext hook
    const [contextDispatch] = useContext(PlanContext);
    const [planTitleValue, setPlanTitleValue] = useState('');

    function addUserPlan(plan) {
        console.log(plan);
        return postPlan(plan)
            .then((res) => {
                console.log(res.id);
                return res.id;
            })
            .then((createdPlanId) => {
                getUserPlans()
                    .then((updatedPlans) => {
                        console.log(updatedPlans);
                        contextDispatch({type:'field',field:'plans',payload:updatedPlans});
                        return updatedPlans;
                    })
                    .catch((err) => console.log(err));
                return createdPlanId;
            })
            .catch((err) => console.log(err));
    }
    async function createNewPlan(importedPlan) {
        let newPlanObj = {};
        if (importedPlan || planTitleValue.trim().length > 0) {
            newPlanObj.title = (planTitleValue.trim().length > 0) ? planTitleValue : importedPlan.title;
            const newPlanId = await addUserPlan(newPlanObj);
            console.log(`newPlanId: ${newPlanId}
                            importedPlan: ${importedPlan}
                            newPlanObj: ${newPlanObj}`);
            if (importedPlan) {
                delete importedPlan.title;
                console.log(`After Delete...
                            importedPlan: ${importedPlan}
                            newPlanObj: ${newPlanObj}`);

                for (let key in importedPlan) {
                    const object = importedPlan[key];
                    if ( key === 'sub_plans') {
                        for (let objKey in object) {
                            object[objKey].parent = newPlanId;
                        }
                    } else {
                        newPlanObj[key] = importedPlan[key];
                    }
                }
                const updatedPlanObj = {...importedPlan};
                console.log(updatedPlanObj);
                const response = await props.savePlanChanges(
                    newPlanId,
                    updatedPlanObj
                );
                console.log(response);
                if (response === 1) {
                    props.handleMainAppView('HomePage');
                } else {
                    alert("There was an error saving the imported data.")
                }
            } else {
                props.handleMainAppView('HomePage');
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
                Start Your Project
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
