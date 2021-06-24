import React, {useState, useEffect} from 'react';
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectDetails from './main_views/ProjectDetails.js';
import NewProject from './main_views/NewProject.js';

//import Preloader from './utility_components/Preloader.js';

import {getUserPlans, putPlanUpdate, deletePlan, postPlan} from './api/projectsApi';

function AppBody (props) {
    const [mainAppView, setMainAppView] = useState('HomePage');
    const [userPlans, setUserPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
    //id:"",title: "",tools: [],materials: [],project_steps: [],video_urls: []
    const [results, setResults] = useState([]);

    useEffect(() => {
        getUserPlans().then((plans) => {
            setUserPlans(plans);
        })
    },[])
//Functions for props to lift state
    function handleMainAppView (view) {
        setMainAppView(view);
    }
    function updateSearchResults(resultsArr){
        setResults(resultsArr);
    }
    function updateSelectedPlan (selectedPlanId) {
        const selectedPlanIndex = userPlans.findIndex(plan => plan.id === selectedPlanId);
        if (selectedPlanIndex >= 0){
            setSelectedPlanIndex(selectedPlanIndex);
            handleMainAppView('ProjectDetails');
        }
    }
    function addUserPlan(plan){
        postPlan(plan).then((res) => {
            console.log(res.id)
            return res.id;
        }).then((createdPlanId) => {
            getUserPlans().then((plans) => {
                setUserPlans(plans)
                //Maybe find and select the plan here? with a return statement and another .then
                return plans;
            }).then((plans) => {
                const selectedPlanIndex = plans.findIndex(plan => plan.id === createdPlanId);
                setSelectedPlanIndex(selectedPlanIndex);
                return selectedPlanIndex;
            }).then((findResult) => {
                if (findResult > 0){
                    handleMainAppView('ProjectDetails');
                }
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
    function removeUserPlan(planId) {
        deletePlan(planId).then((res) => {
            console.log(res);
            handleMainAppView(null);
            //Update the list of projects
            getUserPlans().then((plans) => {
                setUserPlans(plans);
                //clear the main view
            })

        })
    }
    function savePlanChanges (planId, planUpdateObj) {
        console.log(planUpdateObj);
        putPlanUpdate(planId, planUpdateObj).then((res) => {
            if (res === 1) {
                getUserPlans().then((plans) => {
                    setUserPlans(plans);
                    return;
                }).then(() => {
                    const searchIndex = (item) => item.id === planId;
                    const indexOfPlan = userPlans.findIndex(searchIndex);
                    console.log(indexOfPlan);
                    if (indexOfPlan !== selectedPlanIndex){
                        setSelectedPlanIndex(indexOfPlan);
                    }
                })
            } else {
                console.log("fail");
            }
        })
    }

    return (
        <main id="main-app-container" className="row blue-grey darken-4 blue-grey-text text-lighten-5">
            {mainAppView === 'HomePage' &&
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
            }
            {mainAppView === 'NewProject' &&
                <NewProject
                    addUserPlan={props.addUserPlan}
                    updateSearchResults={props.updateSearchResults}
                    updateSelectedPlan={props.updateSelectedPlan}
                    handleMainAppView={props.handleMainAppView}
                    />
            }
            {mainAppView === 'ProjectDetails' &&
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
            }
            {mainAppView === 'SearchResults' &&
                <SearchResults
                    results={results}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}
                    />
            }
        </main>
    );
}

export default AppBody;
