//Import React and hooks used
import React, { useState, useEffect } from 'react';
//Import Project Components
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectDetails from './main_views/ProjectDetails.js';
import NewProject from './main_views/NewProject.js';
//Import Functions
import {getUserPlans, putPlanUpdate, deletePlan, postPlan} from './api/projectsApi';

//Functional Component
    //Handles the view within the App's <main> html tag
    //"Source of truth" for plan info and handling
function AppBody(props) {
//State Hooks
    const [mainAppView, setMainAppView] = useState('HomePage');
    const [userPlans, setUserPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);

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
    //Changes which of the user's plans are displayed
    function updateSelectedPlan(selectedPlanId) {
        const selectedPlanIndex = userPlans.findIndex(
            (plan) => plan.id === selectedPlanId
        );
        if (selectedPlanIndex >= 0) {
            setSelectedPlanIndex(selectedPlanIndex);
            handleMainAppView('ProjectDetails');
        }
    }

    //Updating database plans and this component's state
    function addUserPlan(plan) {
        console.log(plan);
        return postPlan(plan)
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
                // .then((findResult) => {
                //     if (findResult > 0) {
                //         handleMainAppView('ProjectDetails');
                //     }
                // })
                .catch((err) => console.log(err));
                return createdPlanId;
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
        return putPlanUpdate(planId, planUpdateObj).then((res) => {
            console.log("plan update put");
            if (res === 1) {
                return getUserPlans()
                    .then((plans) => {
                        console.log("got updated user plans");
                        console.log(plans);
                        setUserPlans(plans);
                        return plans;
                    })
                    .then((returnedPlans) => {
                        //This section is only necessary if an unselected plan can be edited and we want the app to auto select it
                        console.log("searching for updated plan");
                        const searchIndex = (item) => item.id === planId;
                        const indexOfPlan = returnedPlans.findIndex(searchIndex);
                        console.log(indexOfPlan);
                        if (indexOfPlan !== selectedPlanIndex) {
                            setSelectedPlanIndex(indexOfPlan);
                        }
                        return res;
                    });

            } else {
                console.log('fail');
            }
        });
    }
    function addScrapedDataToPlan (scrapedData) {
        console.log(scrapedData);
        const fieldsToUpdate = Object.keys(scrapedData);
        const currentPlan = userPlans[selectedPlanIndex];
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
        console.log(userPlans[selectedPlanIndex].id, updatedPlanFields);
        savePlanChanges(userPlans[selectedPlanIndex].id, updatedPlanFields);
        handleMainAppView("ProjectDetails");
    }
//Return view to render based on state of main app view
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
                    handleMainAppView={handleMainAppView}
                />
            )}
            {mainAppView === 'NewProject' && (
                <NewProject
                    addUserPlan={addUserPlan}
                    updateSelectedPlan={updateSelectedPlan}
                    mainAppView = {mainAppView}
                    handleMainAppView={handleMainAppView}
                    savePlanChanges={savePlanChanges}
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
                    handleMainAppView={handleMainAppView}
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
