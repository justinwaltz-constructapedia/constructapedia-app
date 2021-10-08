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
    const [contextState, contextDispatch] = useContext(PlanContext);
    const [planTitleValue, setPlanTitleValue] = useState('');

    // function addUserPlan(plan) {
    //     console.log(plan);
    //     return postPlan(plan)
    //         .then((res) => {
    //             console.log('1',res.id);
    //             return res.id;
    //         })
    //         .then((createdPlanId) => {
    //             getUserPlans()
    //                 .then((updatedPlans) => {
    //                     console.log(updatedPlans);
    //                     contextDispatch({type:'field',field:'plans',payload:updatedPlans});
    //                     return updatedPlans;
    //                 })
    //                 .catch((err) => console.log(err));
    //             return createdPlanId;
    //         })
    //         .catch((err) => console.log(err));
    // }
    async function createNewPlan(importedPlan) {
        if (importedPlan || planTitleValue.trim().length > 0) {
            const newPlanTitle = (planTitleValue.trim().length > 0) ? planTitleValue : importedPlan.title;
            console.log('1', newPlanTitle);
            const newPlanRes = await postPlan({title:newPlanTitle});
            const newPlanId = newPlanRes.id
            console.log('2', newPlanId);
            if (importedPlan) {
                delete importedPlan.title;
                const updatedPlanObj = {};
                for (let key in importedPlan) {
                    if ( key === 'steps') {
                        continue;
                    } else {
                        updatedPlanObj[key] = importedPlan[key];
                    }
                }
                console.log(`3
                                newPlanId: ${newPlanId}
                                importedPlan: ${importedPlan}
                                updatedPlanObj: ${updatedPlanObj}`);
                const response = await props.savePlanChanges(
                    newPlanId,
                    updatedPlanObj
                );
                console.log('4', response);
                for (let i = 0; i < importedPlan.steps.length; i++) {
                    console.log(`5
                                title: ${importedPlan.steps[i].title}
                                parent: ${newPlanId}
                                step body: ${importedPlan.steps[i].body}
                    `);
                    await postPlan({
                        title: importedPlan.steps[i].title,
                        parent: newPlanId,
                        notes: [{contents:importedPlan.steps[i].body}],
                        import_url: importedPlan.import_url
                    })
                }
                const updatedUserPlans = await getUserPlans()
                contextDispatch({type:'field', field: 'plans', payload: updatedUserPlans})
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
