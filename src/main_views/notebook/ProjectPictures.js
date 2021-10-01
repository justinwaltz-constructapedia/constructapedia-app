import React, { useState, useEffect, useContext, useRef } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'
import { gapi } from 'gapi-script';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

function ProjectPictures (props) {
    //useState Hooks
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesInfo, setSelectedFilesInfo] = useState([]);
    const [newPhotoStage, setNewPhotoStage] = useState('existingConditions');
    //useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
    const {plans, selectedPlanIndex, selectedSowId} = contextState;
    //Material <select> fields
    const photoCategorySelect = useRef(null);

    //Intitialzes Materialize form select
    //Runs on every render
    useEffect(() => {
        M.FormSelect.init(photoCategorySelect.current);
    },[]);

    const onFileChange = async (event) => {
        let fileReader;
        const filesList = event.target.files
        const selectedFilesInfoArray = []
        const selectedFilesArray = []
        const handleFileChosen = (file, type) => {
            fileReader = new FileReader();
            fileReader.onloadend = () => {
                const content = fileReader.result;
                const fileAsString = content.replace(`data:${type};base64,`,"")
                selectedFilesArray.push({
                    file: fileAsString
                })
            }
            //handleFileRead;
            fileReader.readAsDataURL(file);
        };
        for (let i = 0; i < filesList.length; i++) {
            handleFileChosen(filesList[i], filesList[i].type)
            selectedFilesInfoArray.push({
                name: filesList[i].name,
                type: filesList[i].type
            })
        }
        //Update State
        setSelectedFilesInfo(selectedFilesInfoArray);
        //Update State
        setSelectedFiles(selectedFilesArray);
        console.log('Project Pictures ln 53',selectedFilesArray);
    }

    const uploadFileToGdrive = async (event) => {
        event.preventDefault()
        //Get the selected top level SOW
        const selectedProject = {...plans[selectedPlanIndex]}
        //Get the Google Drive folder Id for the Selected Project; if none exist, create one first
        let parentFolderId;

        if (selectedProject.google_drive_folder_id == undefined) {
            const folderCreationRes = await props.createDriveFolder(selectedProject.title, props.mainDriveFolderId)
            console.log('ProjectPictures ln 65', folderCreationRes);
            parentFolderId = folderCreationRes.id
        } else {
            parentFolderId = selectedProject.google_drive_folder_id
        }
        console.log(parentFolderId);
        var fileData=selectedFiles[0].file;
        const boundary='foo_bar_baz'
        const delimiter = "--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        const fileName=selectedFilesInfo[0].name;
        const contentType=selectedFilesInfo[0].type;
        // const parentFolderId = props.mainDriveFolder
        const metadata = {'name': fileName,'mimeType': contentType, 'parents': [parentFolderId]};
        const multipartRequestBody = delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) + "\r\n" +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n\r\n' +
        fileData +
        close_delim;
        var request = gapi.client.request({
            'path': 'https://www.googleapis.com/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {'Content-Type': 'multipart/form-data; boundary=' + boundary},
            'body': multipartRequestBody
        });
        request.execute(function(file) {
            console.log('ProjectPictures ln94 returned file',file)
            const newPhotoObj = {
                name: file.name,
                gdriveId: file.id,
                stage: newPhotoStage,
                order: 0,
                parent: props.parentSowId,
                caption: ''
            }
            //DEV NOTE:: This makes the new photo first in the array
            const updatedPhotos=[newPhotoObj].concat([...props.photos])
            if (selectedProject.google_drive_folder_id == undefined) {
                props.saveToSowImages(updatedPhotos, parentFolderId);
            } else {
                props.saveToSowImages(updatedPhotos);
            }
        });
    }
    const getFileFromGdrive = (imageId) => {
        console.log(imageId);
    }

    return (
        <div className='col s12'>
            <div className='card-panel center red-text text-accent-4'>
                <i className='material-icons'>
                    photo_library
                </i>
                <p>Project Pictures</p>
                <div className='row'>
                    <div className='col s12 m4'>
                        <div className='card'>
                            Existing Conditions
                            and Planning
                        </div>
                    </div>
                    <div className='col s12 m4'>
                        <div className='card'>
                            Progress Photos
                        </div>
                    </div>
                    <div className='col s12 m4'>
                        <div className='card'>
                            Finished Photos
                        </div>
                    </div>
                    <div className = "row">
                        <form className = "col s12">
                            <div className = "row">
                                <div className='col s12 m6'>
                                    <label>Single File Input</label>
                                    <div className = "file-field input-field">
                                        <div className = "btn">
                                            <span>Browse</span>
                                            <input type = "file" onChange={onFileChange}/>
                                        </div>
                                        <div className = "file-path-wrapper">
                                            <input className = "file-path validate" type = "text" placeholder = "Upload file" />
                                        </div>
                                    </div>
                                </div>
                                <div className = "col s12 m6">
                                    <label>Multi File Input</label>
                                    <div className = "file-field input-field">
                                        <div className = "btn disabled">
                                            <span>Browse</span>
                                            <input disabled type = "file" multiple onChange={onFileChange}/>
                                        </div>
                                        <div className = "file-path-wrapper">
                                            <input className = "file-path validate" type = "text" placeholder = "Upload multiple files" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row valign-wrapper'>
                                <div className='input-field col s4 offset-s2'>
                                    <select ref={photoCategorySelect}
                                            value={newPhotoStage}
                                            onChange={(e)=>setNewPhotoStage(e.target.value)}>
                                        <option value="existingConditions">Existing Conditions</option>
                                        <option value="progress">Progress</option>
                                        <option value="finished">Finished</option>
                                    </select>
                                    <label>Project Stage</label>
                                </div>
                                <button className = "btn left" onClick={(e)=>uploadFileToGdrive(e)}>
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectPictures;
