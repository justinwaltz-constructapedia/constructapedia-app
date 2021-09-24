//Import React and hooks used
import React, { useState, useContext, useEffect } from 'react';
//Import for useContext
import {PlanContext} from './PlanContext.js'
//Import Project Components
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectLevel from './main_views/ProjectLevel.js';
import NewProject from './main_views/NewProject.js';
import Preloader from './utility_components/Preloader.js';
//Import Functions
import {getUserPlans, putPlanUpdate} from './api/projectsApi';

// function init(initialState) {
//     return {
//         plans: initialState,
//
//     }
// }
//
// function reducer (state, action) {
//     switch (action.type) {
//         case 'field':
//             return {
//                 ...state,
//                 [action.field]: action.payload
//             };
//         default:
//             return state;
//     }
// }

//Functional Component
    //Handles the view within the App's <main> html tag
    //"Source of truth" for plan info and handling
function AppBody(props) {
//useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
//State Hooks
    const [mainAppView, setMainAppView] = useState('HomePage');
/**
 * useEffect Hooks
 */
    // useEffect(() => {
    //     console.log("appBody ln 45 selectedPlanIndex",contextState.selectedPlanIndex);
    // })
//Functions for props to lift state
    //Handling views of child components
    function handleMainAppView(view) {
        setMainAppView(view);
    }

    function getSowObj (plansArr) {
        let sowObj;
        for (var i = 0; i < plansArr.length; i++) {
            if (plansArr[i].id === contextState.selectedSowId){
                sowObj = plansArr[i]
                break;
            } else if (plansArr[i].sub_plans && plansArr[i].sub_plans.length > 0) {
                sowObj = getSowObj(plansArr[i].sub_plans)
            } else {
                continue;
            }
        }
        return sowObj;
    }

    // //Changes which of the user's plans are displayed
    function selectPlan(selectedPlanIndex) {
        contextDispatch({type:'field',field:'selectedSowId', payload:contextState.plans[selectedPlanIndex].id});
        contextDispatch({type:'field',field:'selectedPlanIndex', payload:selectedPlanIndex});
        handleMainAppView('ProjectDetails')
    }
    function savePlanChanges(planId, sowUpdateObj) {
        return putPlanUpdate(planId, sowUpdateObj).then((res) => {
            console.log("plan update put");
            if (res === 1) {
                return getUserPlans()
                    .then((updatedPlans) => {
                        console.log("got updated user plans");
                        console.log(updatedPlans);
                        contextDispatch({type:'field',field:'plans',payload:updatedPlans});
                        return res;
                    })
            } else {
                console.log('fail');
            }
        });
    }

    function addScrapedDataToPlan (scrapedData) {
        console.log(scrapedData);
        let currentPlan;
        if (contextState.plans[contextState.selectedPlanIndex].id === contextState.selectedSowId) {
            currentPlan = {...contextState.plans[contextState.selectedPlanIndex]}
        } else {
            currentPlan = getSowObj([...contextState.plans[contextState.selectedPlanIndex].sub_plans]);
        }
        const fieldsToUpdate = Object.keys(scrapedData);
        const updatedPlanFields = {};
        fieldsToUpdate.forEach((fieldName, i) => {
            console.log('appBody 102',scrapedData[fieldName]);
            if (fieldName !== 'title') {
                let planField;
                if (fieldName === 'checks') {
                    planField = currentPlan[fieldName].reduce((arr, item) => {
                        arr.push(item)
                        return arr;
                    },[...scrapedData[fieldName]])
                } else {
                    //planField = scrapedData[fieldName];
                    planField = scrapedData[fieldName].concat([...currentPlan[fieldName]]);
                }
                console.log('appbody ln 114', planField);
                updatedPlanFields[fieldName] = planField;
            }
        });
        console.log('appbody 118 updatedplanfields', updatedPlanFields);
        savePlanChanges(contextState.selectedSowId, updatedPlanFields);
        handleMainAppView("ProjectDetails");
    }
//Return view to render based on state of main app view
    if (contextState.plans) {
        return (
            <main id='main-app-container' className='row'>
                {mainAppView === 'HomePage' && (
                    <HomePage
                        selectPlan={selectPlan}
                        handleMainAppView={handleMainAppView}
                    />
                )}
                {mainAppView === 'NewProject' && (
                    <NewProject
                        selectPlan={selectPlan}
                        mainAppView = {mainAppView}
                        handleMainAppView={handleMainAppView}
                        savePlanChanges={savePlanChanges}
                    />
                )}
                {mainAppView === 'ProjectDetails' && (
                    <ProjectLevel
                        selectPlan={selectPlan}
                        handleMainAppView={handleMainAppView}
                        savePlanChanges={savePlanChanges}
                        getSowObj={getSowObj}
                    />
                )}
                {mainAppView === 'SearchResults' && (
                    <SearchResults
                        mainAppView={mainAppView}
                        handleMainAppView={handleMainAppView}
                        placeholder="Constructapedia"
                        handleScrapedData={addScrapedDataToPlan}
                    />
                )}
            </main>
        );
    } else {
        return <Preloader/>;
    }

}

export default AppBody;
