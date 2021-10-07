import React, { useReducer, useContext } from 'react';
import {PlanContext} from './PlanContext.js'
import GoogleDriveImage from './assets/google-drive.png';
import ListGoogleDriveDocuments from './ListGoogleDriveDocuments.js';
import Preloader from './utility_components/Preloader.js';
import { gapi } from 'gapi-script';
// import { signInToGoogleDrive } from './api/googleDriveApi.js';
import { putUserUpdate } from './api/userApi.js';
//Google Drive API Variables
// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;
// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file';
// https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile

function reducer (state, action) {
    switch (action.type) {
        // case 'saving':
        //     return {
        //         ...state,
        //         error: '',
        //         isSaving: true
        //     }
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        // case 'error':
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isSaving: false,
        //     }
        default:
            return state;
    }
}

function GoogleDriveFiles (props) {
    const initialState = {
        documents: [],
        isLoadingGoogleDriveApi: false,
        isFetchingGoogleDriveFiles: false,
        signedInGoogleUser: '',
        googleAuth: null,
    }
    const [state,dispatch] = useReducer(reducer, initialState)
    const { documents, isLoadingGoogleDriveApi, isFetchingGoogleDriveFiles, signedInGoogleUser } = state;
    /**
     * useContext Hook
     */
    const [contextState] = useContext(PlanContext);
    const {selectedSowId} = contextState;

    /**
       *  Sign in the user upon button click.
       */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();

    };

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            // Set the signed in user
            console.log('current google user',gapi.auth2.getAuthInstance().currentUser);
            dispatch({type:'field', field:'signedInGoogleUser', payload:gapi.auth2.getAuthInstance().currentUser.le.wt.Ad});
            dispatch({type:'field', field:'isLoadingGoogleDriveApi', payload:false});
            if (!props.mainDriveFolder) {
                const mainDriveFolderId = props.createDriveFolder('Constructapedia').then((response) => {
                    console.log('GoogleDriveFiles ln 139 ', response.id);
                    props.updateUser({google_drive_folder_id: response.id})
                })
            }
            // list files if user is authenticated
            // listFiles();
        } else {
            // prompt user to sign in
            handleAuthClick();
        }
    };
    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = (event) => {
        gapi.auth2.getAuthInstance().signOut();
    };

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = () => {
        dispatch({type:'field', field:'isLoadingGoogleDriveApi', payload:true});
        gapi.client
        .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })
        .then(
            function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            function (error) {
                console.log(error);
            }
        );
    };

    const handleClientLoad = async () => {
        gapi.load('client:auth2', initClient);
    };

    if ((isLoadingGoogleDriveApi)) {
        return <Preloader/>
    } else {
        return (
            <div className='row'>
                {(signedInGoogleUser.length > 0)?
                        <div className='container'>
                            <p>Signed In as: {`${signedInGoogleUser} `}</p>
                            <div className='row'>
                                <button type="button" className='btn' onClick={handleSignOutClick}>Sign Out</button>
                            </div>
                        </div>
                        :
                        <div onClick={() => handleClientLoad()} className="row center">
                            <div className="icon-container">
                                <div className="icon icon-success">
                                    <img height="80" width="80" src={GoogleDriveImage} />
                                </div>
                            </div>
                            <div className="content-container">
                                <p className="title">Google Drive</p>
                                <span className="content">Store Images in your google drive</span>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default GoogleDriveFiles;
/**
<ListGoogleDriveDocuments
    visible={listDocumentsVisible}
    onClose={onClose}
    documents={documents}
    onSearch={listFiles}
    signedInUser={signedInGoogleUser}
    onSignOut={handleSignOutClick}
    isLoading={isFetchingGoogleDriveFiles}
/>
<button className='btn' type='button' onClick={()=>createDriveFolder('Constructapedia')}>Create Folder</button>
<button className='btn' type='button' onClick={listFiles}>List Files</button>
 */

 /**
 * Print files.
 */
 // const listFiles = (searchTerm = null) => {
 //     dispatch({type:'field', field:'isFetchingGoogleDriveFiles', payload:true});
 //     // console.log(gapi.client.drive.files.list({pageSize: 10,fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',q:''}));
 //     let listQueryObj;
 //     if (searchTerm) {
 //         listQueryObj = {
 //           pageSize: 10,
 //           fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
 //           q: `name = '${searchTerm}'`
 //         }
 //     } else {
 //         listQueryObj = {
 //           pageSize: 10,
 //           fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)'
 //         }
 //     }
 //     gapi.client.drive.files
 //       .list(listQueryObj)
 //       .then(function (response) {
 //         // console.log(response);
 //         dispatch({type:'field', field:'isFetchingGoogleDriveFiles', payload:false});
 //         dispatch({type:'field', field:'listDocumentsVisibility', payload:true});
 //         const res = JSON.parse(response.body);
 //         console.log(res);
 //         dispatch({type:'field', field:'documents', payload:res.files});
 //       });
 // };
