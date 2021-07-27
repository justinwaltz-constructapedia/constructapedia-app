import React, { useState, useEffect } from 'react';
//Project Components
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectDetails from './main_views/ProjectDetails.js';
import NewProject from './main_views/NewProject.js';
//Project API Calls
import {getUserPlans, putPlanUpdate, deletePlan, postPlan} from './api/projectsApi';

function AppBody(props) {
//State Hooks for Components in the <main> tag
    const [mainAppView, setMainAppView] = useState('HomePage');
    const [userPlans, setUserPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
    const [results, setResults] = useState([]);

//Effect Hooks
    //Gets user plans only on Mount
    useEffect(() => {
        getUserPlans().then((plans) => {
            setUserPlans(plans);
        });
    }, []);

//Functions for props to lift state
    //Handling views of child components
    function handleMainAppView(view) {
        setMainAppView(view);
    }
    function updateSearchResults(resultsArr) {
        setResults(resultsArr);
    }
    function updateSelectedPlan(selectedPlanId) {
        const selectedPlanIndex = userPlans.findIndex(
            (plan) => plan.id === selectedPlanId
        );
        if (selectedPlanIndex >= 0) {
            setSelectedPlanIndex(selectedPlanIndex);
            handleMainAppView('ProjectDetails');
        }
    }
    //Updating database plans and this components state
    function addUserPlan(plan) {
        postPlan(plan)
            .then((res) => {
                console.log(res.id);
                return res.id;
            })
            .then((createdPlanId) => {
                getUserPlans()
                .then((plans) => {
                    setUserPlans(plans);
                    //Maybe find and select the plan here? with a return statement and another .then
                    return plans;
                })
                .then((plans) => {
                    const selectedPlanIndex = plans.findIndex(
                        (plan) => plan.id === createdPlanId
                    );
                    setSelectedPlanIndex(selectedPlanIndex);
                    return selectedPlanIndex;
                })
                .then((findResult) => {
                    if (findResult > 0) {
                        handleMainAppView('ProjectDetails');
                    }
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }
    function removeUserPlan(planId) {
        deletePlan(planId).then((res) => {
            console.log(res);
            //Update the list of projects
            getUserPlans().then((plans) => {
                setUserPlans(plans);
                //return the main view to home page
                handleMainAppView('HomePage');
            });
        });
    }
    function savePlanChanges(planId, planUpdateObj) {
        console.log(planUpdateObj);
        putPlanUpdate(planId, planUpdateObj).then((res) => {
            console.log("plan update put");
            if (res === 1) {
                getUserPlans()
                    .then((plans) => {
                        console.log("got updated user plans");
                        console.log(plans);
                        setUserPlans(plans);
                        return;
                    })
                    .then(() => {
                        //This section is only necessary if an unselected plan can be edited and we want the app to auto select it
                        console.log("searching for updated plan");
                        const searchIndex = (item) => item.id === planId;
                        const indexOfPlan = userPlans.findIndex(searchIndex);
                        console.log(indexOfPlan);
                        if (indexOfPlan !== selectedPlanIndex) {
                            setSelectedPlanIndex(indexOfPlan);
                        }
                    });
            } else {
                console.log('fail');
            }
        });
    }
//Return view to render
    return (
        <main id='main-app-container' className='row'>
            {mainAppView === 'HomePage' && (
                <HomePage
                    userPlans={userPlans}
                    selectedPlanIndex={selectedPlanIndex}
                    updateSelectedPlan={updateSelectedPlan}
                    addUserPlan={addUserPlan}
                    removeUserPlan={removeUserPlan}
                    savePlanChanges={savePlanChanges}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}
                />
            )}
            {mainAppView === 'NewProject' && (
                <NewProject
                    addUserPlan={addUserPlan}
                    updateSearchResults={updateSearchResults}
                    updateSelectedPlan={updateSelectedPlan}
                    mainAppView = {mainAppView}
                    handleMainAppView={handleMainAppView}
                    results={results}
                />
            )}
            {mainAppView === 'ProjectDetails' && (
                <ProjectDetails
                    userPlans={userPlans}
                    selectedPlanIndex={selectedPlanIndex}
                    updateSelectedPlan={updateSelectedPlan}
                    addUserPlan={addUserPlan}
                    removeUserPlan={removeUserPlan}
                    savePlanChanges={savePlanChanges}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}
                />
            )}
            {mainAppView === 'SearchResults' && (
                <SearchResults
                    mainAppView={mainAppView}
                    results={results}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}
                />
            )}
        </main>
    );
}

export default AppBody;
