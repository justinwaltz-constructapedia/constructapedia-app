import React, {useState, useEffect} from 'react';
import Projects from './side_navs/Projects.js';
import SearchResults from './search_col/SearchResults.js';
import ProjectDetails from './notebook_col/ProjectDetails.js';

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
            <Projects
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
            {mainAppView === 'ProjectDetails' &&
                <ProjectDetails
                    userPlans={userPlans}
                    selectedPlanIndex={selectedPlanIndex}
                    updateSelectedPlan={updateSelectedPlan}
                    addUserPlan={addUserPlan}
                    removeUserPlan={removeUserPlan}
                    savePlanChanges={savePlanChanges}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}/>
            }
            {mainAppView === 'SearchResults' &&
                <SearchResults
                    results={results}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}/>
            }
        </main>
    );
}

export default AppBody;


/*
function updateProjectDraft(project){
    const projectDraftCopy = projectDraft;
    for (let i = 0; i < project.tools.length; i++) {
        if (projectDraftCopy.tools.includes(project.tools[i])){
            continue;
        } else {
            projectDraftCopy.tools.push(project.tools[i]);
        }
    }
    for (let i = 0; i < project.materials.length; i++) {
        if (projectDraftCopy.materials.includes(project.materials[i])){
            continue;
        } else {
            projectDraftCopy.materials.push(project.materials[i]);
        }
    }
    for (let i = 0; i < project.video_urls.length; i++) {
        if (projectDraftCopy.video_urls.includes(project.video_urls[i])){
            continue;
        } else {
            projectDraftCopy.video_urls.push(project.video_urls[i]);
        }
    }
    for (let i = 0; i < project.project_steps.length; i++) {
        projectDraftCopy.project_steps.splice(i, 0, project.project_steps[i])
    }
    console.log(projectDraftCopy);
    setProjectDraft(projectDraftCopy);
    console.log(projectDraft);
    return;
}
function importUserProjects() {
    getUserProjects()
    .then( (projectsArr) => {
        console.log(typeof projectsArr, projectsArr)
        setUserProjects(projectsArr);
        console.log(projectDraft);
    })
    .catch(err => console.log(err));
}
*/
