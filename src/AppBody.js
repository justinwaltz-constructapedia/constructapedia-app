//Import React and hooks used
import React, { useState, useContext } from 'react';
//Import for useContext
import {PlanContext} from './PlanContext.js'
//Import Project Components
import HomePage from './main_views/HomePage.js';
import SearchResults from './main_views/SearchResults.js';
import ProjectLevel from './main_views/ProjectLevel.js';
import NewProject from './main_views/NewProject.js';
import GoogleDriveLogin from './GoogleDriveLogin.js';
import Preloader from './utility_components/Preloader.js';
//Import API Functions
import {getUserPlans, putPlanUpdate} from './api/projectsApi';
import { gapi } from 'gapi-script';

/**
 * [AppBody description]
 * "Source of truth" for plans/projects info and handling
 * {[Functional Component]} props [from App.js]
 */
function AppBody(props) {
    //useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
    //State Hooks
    const [mainAppView, setMainAppView] = useState('HomePage');

    //Functions for props to lift state
        //Handling views of child components
    function handleMainAppView(view) {
        setMainAppView(view);
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
    //DEV NOTE:: could possibly be combined with the function to create a new plan from scrapedData
    function addScrapedDataToPlan (scrapedData) {
        console.log(scrapedData);
        let currentPlan = {...contextState.selectedSow}
        // if (contextState.plans[contextState.selectedPlanIndex].id === contextState.selectedSowId) {
        //     currentPlan = {...contextState.plans[contextState.selectedPlanIndex]}
        // } else {
        //     currentPlan = getSowObj([...contextState.plans[contextState.selectedPlanIndex].sub_plans]);
        // }
        const fieldsToUpdate = Object.keys(scrapedData);
        const updatedPlanFields = {};
        fieldsToUpdate.forEach((fieldName, i) => {
            console.log('appBody 76',scrapedData[fieldName]);
            if (fieldName !== 'title') {
                let planField;
                if (fieldName === 'checks') {
                    planField = currentPlan[fieldName].reduce((arr, item) => {
                        arr.push(item)
                        return arr;
                    },[...scrapedData[fieldName]])
                } else {
                    planField = scrapedData[fieldName].concat([...currentPlan[fieldName]]);
                }
                console.log('appbody ln 87', planField);
                updatedPlanFields[fieldName] = planField;
            }
        });
        console.log('appbody 91 updatedplanfields', updatedPlanFields);
        savePlanChanges(contextState.selectedSowId, updatedPlanFields);
        handleMainAppView("ProjectDetails");
    }
    /**
     * Create a google drive folder
     */
    const createDriveFolder = (name, parentFolderId) => {
        console.log('AppBody ln 99',name, parentFolderId);
        let folderMetaData;
        if (parentFolderId) {
            folderMetaData = {
                'name' : name,
                'mimeType':'application/vnd.google-apps.folder',
                'parents': [parentFolderId]
            }
        } else {
            folderMetaData = {
                'name' : name,
                'mimeType':'application/vnd.google-apps.folder'
            }
        }
        console.log('AppBody ln 120', folderMetaData);
        return gapi.client.drive.files.create({
            resource: folderMetaData,
            fields:'id, name'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.id);
            }
        }).then((res) => {
            console.log('AppBoby ln125 res ',res);
            return JSON.parse(res.body);
        }).then((json) => {
            return json
        })
    }
//Return view to render based on state of main app view
    if (contextState.plans) {
        return (
            <main id='main-app-container' className='row'>
                {mainAppView === 'HomePage' && (
                    <>
                        <HomePage
                            //selectPlan={selectPlan}
                            handleMainAppView={handleMainAppView}
                        />
                        <GoogleDriveLogin
                            mainDriveFolder={props.user.google_drive_folder_id}
                            updateUser={props.updateUser}
                            createDriveFolder={createDriveFolder}
                        />
                    </>
                )}
                {mainAppView === 'NewProject' && (
                    <NewProject
                        mainAppView = {mainAppView}
                        handleMainAppView={handleMainAppView}
                        savePlanChanges={savePlanChanges}
                    />
                )}
                {mainAppView === 'ProjectDetails' && (
                    <ProjectLevel
                        handleMainAppView={handleMainAppView}
                        savePlanChanges={savePlanChanges}
                        mainDriveFolderId={props.user.google_drive_folder_id}
                        createDriveFolder={createDriveFolder}
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
