import React, { useState, useEffect, useContext, useRef } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'
import { gapi } from 'gapi-script';
import Preloader from '../../utility_components/Preloader.js';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

function ProjectPictures (props) {
    const initialPhotoSections = {existingConditions:[],progress:[],finished:[]}
    //useState Hooks
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesInfo, setSelectedFilesInfo] = useState([]);
    const [newPhotoStage, setNewPhotoStage] = useState('existingConditions');
    const [photoSections, setPhotoSections] = useState(initialPhotoSections);
    const [imagesAreLoading, setImagesAreLoading] = useState(true);
    //useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
    const {plans, selectedSow, selectedSowId, projectGdriveFolder} = contextState;
    //useRef Hooks
    const imgSingleInput = useRef(null);
    //Material <select> fields
    const photoCategorySelect = useRef(null);

    //Intitialzes Materialize form select
    //Runs on initial render
    useEffect(() => {
        M.FormSelect.init(photoCategorySelect.current);
    },[]);
    useEffect(() => {
        // && selectedSow.images.length > 0
        if (gapi.client) {
            populatePhotoDisplayArrays(selectedSow.images);
        }


    },[selectedSow])
    useEffect(() => {
        const photoElems = document.querySelectorAll('.materialboxed');
        const photoInstances = M.Materialbox.init(photoElems);
        const btnElems = document.querySelectorAll('.fixed-action-btn');
        const btnInstances = M.FloatingActionButton.init(btnElems);
    })
    const onFileChange = async () => {
        let fileReader;
        console.log(imgSingleInput.current.files);
        const filesList = imgSingleInput.current.files
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
            fileReader.readAsDataURL(file);
        };
        for (let i = 0; i < filesList.length; i++) {
            //console.log('ln 46',filesList[i]);
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
    }

    const handleFileUploads = async (event) => {
        event.preventDefault()
        for (let i = 0; i < selectedFiles.length; i++) {
            await uploadFileToGdrive(selectedFiles[i].file, selectedFilesInfo[i])
            if (i === selectedFiles.length-1) {
                //Update State
                setSelectedFilesInfo([]);
                //Update State
                setSelectedFiles([]);
                //Update Ref
                imgSingleInput.current.value = '';
                // imgSingleInput.current.files = {};
            }
        }
    }

    const uploadFileToGdrive = async (fileToUpload, fileInfo) => {
        let parentFolder = projectGdriveFolder;
        let parentFolderId;
        if (parentFolder.id == undefined) {
            const folderCreationRes = await props.createDriveFolder(parentFolder.title, props.mainDriveFolderId)
            parentFolderId = folderCreationRes.id
        } else {
            parentFolderId = parentFolder.id
        }
        //Get the Google Drive folder Id for the Selected Project; if none exist, create one first
        const fileData=fileToUpload;
        const boundary='foo_bar_baz'
        const delimiter = "--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        const fileName=fileInfo.name;
        const contentType=fileInfo.type;
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
            const newPhotoObj = {
                name: file.name,
                gdriveId: file.id,
                stage: newPhotoStage,
                type: fileInfo.type,
                order: 0,
                parent: props.parentSowId,
                caption: ''
            }
            //DEV NOTE:: This makes the new photo first in the array
            const updatedPhotos=[newPhotoObj].concat([...selectedSow.images])
            setImagesAreLoading(true)
            if (parentFolder.id == undefined) {
                props.saveToSowImages(updatedPhotos, parentFolderId)
            } else {
                props.saveToSowImages(updatedPhotos, parentFolderId)
            }
        });
    }

    const getFileFromGdrive = (imageId, imageName, imageType) => {
        const fileId = imageId;
        //const dest = fs.createWriteStream('/tmp/photo.jpg');
        return gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        }).then((response) => {
            const objectUrl = URL.createObjectURL(new Blob([new Uint8Array(response.body.length).map((_, i) => response.body.charCodeAt(i))], {type: imageType}));
            return objectUrl
        }).catch((err) => console.log(err))
    }

    const deleteFileFromGdrive = (fileId) => {
        console.log(fileId);
        setImagesAreLoading(true);
        var request = gapi.client.drive.files.delete({
            'fileId': fileId
        });
        request.execute(function(resp) {
            console.log(resp);
            const currentPhotos = [...selectedSow.images];
            console.log(currentPhotos.length);
            // function filterById (obj) {
            //         return fileId !== obj.gdriveId;
            // }
            const filteredPhotos = currentPhotos.filter(photo => photo.gdriveId !== fileId)
            console.log(filteredPhotos.length);
            props.saveToSowImages(filteredPhotos);
        })
    }
    const populatePhotoDisplayArrays = async (photosArr) => {
        const existingConditionsArr = [];
        const progressArr = [];
        const finishedArr = [];
        for (var i = 0; i < photosArr.length; i++) {
            const objectUrl = await getFileFromGdrive(photosArr[i].gdriveId, photosArr[i].name, photosArr[i].type)
            switch (photosArr[i].stage) {
                case 'existingConditions':
                    existingConditionsArr.push({name:photosArr[i].name, id:photosArr[i].gdriveId, src:objectUrl})
                    break;
                case 'progress':
                    progressArr.push({name:photosArr[i].name, id:photosArr[i].gdriveId, src:objectUrl})
                    break;
                case 'finished':
                    finishedArr.push({name:photosArr[i].name, id:photosArr[i].gdriveId, src:objectUrl})
                    break;
                default:

            }
            if (i === photosArr.length-1) {
                console.log(existingConditionsArr);
                setImagesAreLoading(true);
                setPhotoSections({
                    existingConditions:existingConditionsArr,
                    progress:progressArr,
                    finished:finishedArr
                });
                setImagesAreLoading(false)
            } else {
                continue;
            }
        }
    }

    const makePhotoElms = (arr) => {
        return arr.map((obj, i) => {
            return (
                <div key={obj.id} className="card">
                    <div className="card-image">
                        <img className="materialboxed" width="100%" src={obj.src}/>
                            <span className="card-title activator" style={{width: "100%"}}>
                                {obj.name}
                                <i className="material-icons right">more_vert</i>
                            </span>
                    </div>
                    <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                            {obj.name}
                            <i className="material-icons right">close</i>
                        </span>
                        <p><b>Caption: </b>{obj.caption !== undefined && obj.caption}</p>
                        <i className="material-icons" onClick={()=>deleteFileFromGdrive(obj.id)}>delete_forever</i>
                    </div>
                </div>

            )
        })
    }

    return (
        <div className='col s12'>
            <div className='card-panel center red-text text-accent-4'>
                <div className='row'>
                    <i className='material-icons'>
                        photo_library
                    </i>
                    <p>Project Pictures</p>
                </div>
                { (selectedSow.images.length > 0) ?
                    <div className='row'>
                        <div className='col s12 m4'>
                            <div className='card'>
                                Existing Conditions
                                and Planning
                            </div>
                            {gapi.client && makePhotoElms(photoSections.existingConditions)}
                        </div>
                        <div className='col s12 m4'>
                            <div className='card'>
                                Progress Photos
                            </div>
                            {gapi.client && makePhotoElms(photoSections.progress)}
                        </div>
                        <div className='col s12 m4'>
                            <div className='card'>
                                Finished Photos
                            </div>
                            {gapi.client && makePhotoElms(photoSections.finished)}
                        </div>
                        { imagesAreLoading &&
                            <div className='section center'>
                                <Preloader/>
                            </div>
                        }
                    </div>
                    :
                    <p> No Saved Images </p>
                }
                <div className = "row">
                    <form className = "col s12">
                        <div className = "row">
                            <div className='col s12 m6'>
                                <label>Single File Input</label>
                                <div className = "file-field input-field">
                                    <div className = "btn">
                                        <span>Browse</span>
                                        <input ref={imgSingleInput} type = "file" onChange={onFileChange}/>
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
                            <button className = "btn left" onClick={(e)=>handleFileUploads(e)}>
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProjectPictures;

// <div className="fixed-action-btn" style={{position: "absolute", display: "inline-block", right: "24px"}}>
//     <a className="btn-floating btn-large red">
//         <i className="large material-icons">mode_edit</i>
//     </a>
//     <ul>
//         <li><a className="btn-floating red"><i className="material-icons">delete_forever</i></a></li>
//         <li><a className="btn-floating yellow darken-1"><i className="material-icons">format_quote</i></a></li>
//         <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
//         <li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
//     </ul>
// </div>

// function ProjectPhotosSubsection (props) {
//     // const [isLoading, setIsLoading] = useState(true);
//     const [photos, setPhotos] = useState([])
//
//     useEffect(() => {
//         const srcUrls = []
//         for (var i = 0; i < props.photos.length; i++) {
//             // const objectUrl =
//             props.getFileFromGdrive(props.photos[i].gdriveId, props.photos[i].name).then((imageUrl) => {
//                 console.log('ln277 ', imageUrl);
//                 srcUrls.push(imageUrl)
//                 let isLoading = true;
//                 if (i === props.photos.length-1) {
//                     isLoading = false
//                 }
//                 return isLoading
//             }).then((stillLoading) => {
//                 if (!stillLoading) {
//                     const newArr = srcUrls.reduce((arr, url, i) => {
//                         arr.push({...props.photos[i], src:url})
//                         console.log(arr);
//                         return arr
//                     },[])
//                     console.log(newArr);
//                     setPhotos(newArr);
//                 } else {
//                     return;
//                 }
//             })
//             // switch (photosArr[i].stage) {
//             //     case 'existingConditions':
//             //         existingConditionsArr.push(objectUrl)
//             //         break;
//             //     case 'progress':
//             //         progressArr.push(objectUrl)
//             //         break;
//             //     case 'finished':
//             //         finishedArr.push(objectUrl)
//             //         break;
//             //     default:
//             //
//             // }
//             console.log('ln293', srcUrls.length);
//             if (i === props.photos.length-1) {
//                 console.log('ln295 building new arr: ', srcUrls.length);
//                 const newArr = srcUrls.reduce((arr, url, i) => {
//                     arr.push({...props.photos[i], src:url})
//                     console.log(arr);
//                     return arr
//                 },[])
//                 console.log(newArr);
//                 setPhotos(newArr);
//                 break;
//             } else {
//                 continue;
//             }
//         }
//     },[props.photos])
//
//
//     const photoDisplay = photos.map((photoObj, i) => {
//         return (
//             <img key={i + photoObj.gdriveId} className='materialboxed' width='100%' src={photoObj.src}/>
//         )
//     })
//
//     // const makePhotoDisplay = () => {
//     //
//     // }
//     return (
//         <div>
//             {photoDisplay}
//         </div>
//     )
// }


// useEffect(() => {
//     const getFileFromGdrive = (imageId, imageName, imageType) => {
//         console.log(imageId);
//         const fileId = imageId;
//         //const dest = fs.createWriteStream('/tmp/photo.jpg');
//         gapi.client.drive.files.get({
//           fileId: fileId,
//           alt: 'media'
//       }).then((response) => {
//             const objectUrl = URL.createObjectURL(new Blob([new Uint8Array(response.body.length).map((_, i) => response.body.charCodeAt(i))], {type: 'image/jpeg'}));
//             imgDisplay.current.src = objectUrl
//
//         }).catch((err) => console.log(err))
//     }
//     for (var i = 0; i < selectedSow.photos.length; i++) {
//         getFileFromGdrive(selectedSow.photos[i].gdriveId, selectedSow.photos[i].name, 'image/jpeg');
//     }
// }, [selectedSow.photos])

// const getFileFromGdrive = (imageId, imageName, imageType) => {
//     console.log(imageId);
//     const fileId = imageId;
//     //const dest = fs.createWriteStream('/tmp/photo.jpg');
//     gapi.client.drive.files.get({
//       fileId: fileId,
//       alt: 'media'
//   }).then((response) => {
//         const objectUrl = URL.createObjectURL(new Blob([new Uint8Array(response.body.length).map((_, i) => response.body.charCodeAt(i))], {type: 'image/jpeg'}));
//         imgDisplay.current.src = objectUrl
//
//     }).catch((err) => console.log(err))
// }