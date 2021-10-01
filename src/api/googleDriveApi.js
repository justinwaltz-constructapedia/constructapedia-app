import { gapi } from 'gapi-script';



//EXPORT FUNCTIONS
/**
 * [signInToGoogleDrive description]
 * @return {[type]} [description]
 */
const uploadPhotos = new Promise((resolve, reject) => {
    //DEV NOTE:: eventually needs to check local storage for credentials
    if (gapi) {
        resolve('ok');
    } else {
        reject('no gapi')
    }
});

export {signInToGoogleDrive}


// //Google Drive API Variables
// // Client ID and API key from the Developer Console
// const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
// const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;
// // Array of API discovery doc URLs for APIs
// const DISCOVERY_DOCS = [
//     'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
// ];
// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file';
// // https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile
// /**
//  *  Initializes the API client library and sets up sign-in state
//  *  listeners.
//  */
// const initClient = () => {
//     gapi.client
//     .init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         discoveryDocs: DISCOVERY_DOCS,
//         scope: SCOPES,
//     })
//     .then(
//         function () {
//             // Listen for sign-in state changes.
//             gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
//             // Handle the initial sign-in state.
//             updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//         },
//         function (error) {
//             console.log(error);
//         }
//     );
// };
// /**
//  *  Called when the signed in status changes. After a sign-in, the API is called.
//  */
// const updateSigninStatus = (isSignedIn) => {
//     if (isSignedIn) {
//         // Set the signed in user
//         return;
//         // list files if user is authenticated
//         // listFiles();
//     } else {
//         // prompt user to sign in
//         gapi.auth2.getAuthInstance().signIn();
//     }
// };
//
// const loadGapiClient = () => {
//     gapi.load('client:auth2', initClient)
// }
