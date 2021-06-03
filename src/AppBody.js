import React, {useState, useEffect} from 'react';
import Project from './side_navs/Project.js';
import SearchResults from './search_col/SearchResults.js';
import ProjectDetails from './notebook_col/ProjectDetails.js';
//import Preloader from './utility_components/Preloader.js';

import {getUserPlans, putPlanUpdate, postPlan, getPlan, deletePlan} from './api/projectsApi';

function AppBody (props) {
    const [mainAppView, setMainAppView] = useState(false);
    const [userPlans, setUserPlans] = useState([]);
    const [planDraft, setPlanDraft] = useState({id:"",title: "",tools: [],materials: [],project_steps: [],video_urls: []});
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
    function changeOrUpdatePlanDraft (newPlan) {
        setPlanDraft(newPlan);
    }
    function addUserPlan(plan){
        const currentPlans = userPlans;
        currentPlans.push(plan);
        setUserPlans(currentPlans);
    }
    function savePlanChanges (planId, planUpdateObj, performPlanDraftUpdate) {
        console.log(planUpdateObj);
        putPlanUpdate(planId, planUpdateObj).then((res) => {
            if (res === 1) {
                getPlan(planId).then((updatedPlan) => {
                    const currentPlans = userPlans;
                    const searchIndex = (item) => item.id === planId;
                    const indexOfPlanToReplace = currentPlans.findIndex(searchIndex);
                    console.log(indexOfPlanToReplace);
                    currentPlans[indexOfPlanToReplace] = updatedPlan;
                    setUserPlans(currentPlans);
                    if (performPlanDraftUpdate){
                        changeOrUpdatePlanDraft(updatedPlan)
                    }
                })
            } else {
                console.log("fail");
            }
        })
    }
    function removeUserPlan (plan) {
        //update userPlans Arr
    }
    return (
        <main id="main-app-container" className="row">
            <Project
                user={props.user}
                userPlans={userPlans}
                updateSearchResults={updateSearchResults}
                planDraft={planDraft}
                changeOrUpdatePlanDraft={changeOrUpdatePlanDraft}
                addUserPlan={addUserPlan}
                handleMainAppView={handleMainAppView}
                removeUserPlan={removeUserPlan}
            />
            {mainAppView === 'ProjectDetails' &&
                <ProjectDetails
                    planDraft={planDraft}
                    changeOrUpdatePlanDraft={changeOrUpdatePlanDraft}
                    savePlanChanges={savePlanChanges}
                    handleMainAppView={handleMainAppView}/>
            }
            {mainAppView === 'SearchResults' &&
                <SearchResults
                    results={results}
                    changeOrUpdatePlanDraft={changeOrUpdatePlanDraft}
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
