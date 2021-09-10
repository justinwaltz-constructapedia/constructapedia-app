//Import React and hooks used
import React, { useState, useContext, useEffect } from 'react';
//Import for useContext
import {PlanContext} from './PlanContext.js'
//Import Project Components
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectLevel from './main_views/ProjectLevel.js';
import NewProject from './main_views/NewProject.js';
//Import Functions
import {getUserPlans, putPlanUpdate} from './api/projectsApi';

//Functional Component
    //Handles the view within the App's <main> html tag
    //"Source of truth" for plan info and handling
function AppBody(props) {
//useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
//State Hooks
    const [mainAppView, setMainAppView] = useState('HomePage');
    // const [userPlans, setUserPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
/**
 * useEffect Hooks
 */
    // Finds and sets selected plan index
    useEffect(() => {
        const selectedPlanIndex = contextState.plans.findIndex(
            (plan) => plan.id === contextState.selectedPlanId
        );
        if (selectedPlanIndex >= 0) {
            setSelectedPlanIndex(selectedPlanIndex);
            //handleMainAppView('ProjectDetails');
        }
    }, [contextState.selectedPlanId, contextState.plans]);

//Functions for props to lift state
    //Handling views of child components
    function handleMainAppView(view) {
        setMainAppView(view);
    }
    // //Changes which of the user's plans are displayed
    function selectPlan(selectedPlanId) {
        if (selectedPlanId !== contextState.selectedPlanId) {
            contextDispatch({type:'field',field:'selectedPlanId',payload:selectedPlanId});
        }
    }
    function savePlanChanges(planId, planUpdateObj) {
        console.log(planUpdateObj);
        return putPlanUpdate(planId, planUpdateObj).then((res) => {
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
        const fieldsToUpdate = Object.keys(scrapedData);
        const currentPlan = contextState.plans[selectedPlanIndex];
        const updatedPlanFields = {};
        fieldsToUpdate.forEach((fieldName, i) => {
            console.log(scrapedData[fieldName][0]);
            if (fieldName !== 'title') {
                let planField;
                if (fieldName === 'checks') {
                    planField = currentPlan[fieldName].reduce((arr, item) => {
                        arr.push(item)
                        return arr;
                    },[scrapedData[fieldName][0]])
                } else {
                    planField = scrapedData[fieldName];
                }
                updatedPlanFields[fieldName] = planField;
            }
        });
        console.log(contextState.plans[selectedPlanIndex].id, updatedPlanFields);
        savePlanChanges(contextState.plans[selectedPlanIndex].id, updatedPlanFields);
        handleMainAppView("ProjectDetails");
    }
//Return view to render based on state of main app view
    return (
        <main id='main-app-container' className='row'>
            {mainAppView === 'HomePage' && (
                <HomePage
                    selectedPlanIndex={selectedPlanIndex}
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
                        selectedPlanIndex={selectedPlanIndex}
                        handleMainAppView={handleMainAppView}
                        plan={contextState.plans[selectedPlanIndex]}
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
}

export default AppBody;
