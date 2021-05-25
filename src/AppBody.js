import React, {useState, useEffect} from 'react';
import Project from './side_navs/Project.js';
import SearchResults from './search_col/SearchResults.js';
import ProjectDetails from './notebook_col/ProjectDetails.js';
//import Preloader from './utility_components/Preloader.js';

import {postNewProject, getUserProjects, putProjectUpdate, postPlan, getPlan} from './api/projectsApi';

function AppBody (props) {
    const [mainAppView, setMainAppView] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [projectDraft, setProjectDraft] = useState({id:"",title: "",tools: [],materials: [],project_steps: [],video_urls: []});
    const [results, setResults] = useState([]);

    useEffect(() => {
        getUserProjects().then((projects) => {
            setUserProjects(projects);
        })
        /*
        getPlan().then((res) => {
            console.log(res)
        })
        */
    },[])

    function handleMainAppView (view) {
        setMainAppView(view);
    }
    function updateSearchResults(resultsArr){
        setResults(resultsArr);
    }
    function changeToNewProject (selectedProject) {
        setProjectDraft(selectedProject);
    }
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

    function createNewProject(project){
        delete project.id;
        postNewProject(project)
        .then( (projectId) => {
            console.log(typeof projectId, projectId)
            const currentUser = props.user;
            currentUser.projects.push(projectId);
            props.updateUser(currentUser);
          })
        .catch(err => console.log(err));
    }

    function createPlan (plan) {
        postPlan(plan)
        .then ((planId) => {
            console.log(planId)
        })
    }
    function saveProjectChanges () {
        const projectToSave = projectDraft
        console.log(projectDraft);
        putProjectUpdate(projectToSave).then((res) => {
            if (res === true) {
                importUserProjects();
                console.log(projectDraft);
            } else {
                console.log("fail");
            }
        })
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

    return (
        <main id="main-app-container" className="row">
            <Project
                user={props.user}
                userProjects={userProjects}
                updateSearchResults={updateSearchResults}
                projectDraft={projectDraft}
                changeToNewProject={changeToNewProject}
                updateProjectDraft={updateProjectDraft}
                createPlan={createPlan}
                handleMainAppView={handleMainAppView}
            />
            {mainAppView === 'ProjectDetails' &&
                <ProjectDetails
                    projectDraft={projectDraft}
                    updateProjectDraft={updateProjectDraft}
                    saveProjectChanges={saveProjectChanges}
                    handleMainAppView={handleMainAppView}/>
            }
            {mainAppView === 'SearchResults' &&
                <SearchResults
                    results={results}
                    updateProjectDraft={updateProjectDraft}
                    updateSearchResults={updateSearchResults}
                    handleMainAppView={handleMainAppView}/>
            }
        </main>
    );
}

export default AppBody;
