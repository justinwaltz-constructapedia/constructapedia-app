//Import React
import React from 'react';
//Import google drive api scripts
import { gapi } from 'gapi-script';
//Import Project Components
import Header from './Header.js';
import Sidenav from './side_navs/Sidenav.js';
//import Footer from './Footer.js';
import AppBody from './AppBody.js';
import Preloader from './utility_components/Preloader.js';
//Imported Functions
import { getUserData } from './api/userApi';
//Import Style
import { getColorTheme } from './classColorThemeVariables.js';
import './Custom.css';

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
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
// https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile

//Only Class Component in the Application; No Hooks
//"Source of truth" for user info and handling
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleClientLoad = this.handleClientLoad.bind(this);
        this.setSigninStatus = this.setSigninStatus.bind(this);
        this.handleSignOutClick = this.handleSignOutClick.bind(this);
        this.initClient = this.initClient.bind(this);
        this.listFiles = this.listFiles.bind(this);
        this.state = {
            isLoggedIn: false,
            isLoading: false,
            user: {},
            selectedColorTheme: getColorTheme('base'),
            isAuthorized: false,
            googleUser: '',
            googleAuth: '',
            isFetchingGoogleDriveFiles: false,
            signInStatus: '',
            userDisplay: '',
        };
    }
    //Life Cycle Methods
    componentDidMount() {
        console.log(localStorage);
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            this.setState({ isLoading: true });
            getUserData()
                .then((userData) => {
                    this.handleLogin(true, userData);
                    this.setState({ isLoading: false });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        this.handleClientLoad();
    }
    //User account functions passed down as props
    //Changes the state of the App to Logged in
    handleLogin(isLoggedIn, user) {
        this.setState({ isLoggedIn: isLoggedIn });
        this.setState({ user: user });
        console.log(this.state.user.name, 'is logged in to app');
    }
    //Changes the State of the App to Logged out
    handleLogout() {
        localStorage.clear();
        window.location.reload(false);
    }
    //Google Drive functions
    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    setSigninStatus(isSignedIn) {
        console.log(isSignedIn);
        console.log(gapi.auth2.getAuthInstance().currentUser);
        if (isSignedIn) {
            // Set the signed in user
            this.setState({
                googleUser: gapi.auth2.getAuthInstance().currentUser.le.wt,
            });
            this.setState({ googleAuth: gapi.auth2.getAuthInstance() });
            this.setState({ isLoadingGoogleDriveApi: false });
            // list files if user is authenticated
            // listFiles();
            console.log('signed in to drive');
        } else {
            // prompt user to sign in
            this.handleAuthClick();
        }
    }

    /**
     *  Sign out the user upon button click.
     */
    handleSignOutClick(event) {
        // setListDocumentsVisibility(false);
        gapi.auth2.getAuthInstance().signOut();
        console.log('signed out of google drive');
    }
    /**
     * Initializes the API client library and sets up sign-in state listeners.
     */
    initClient() {
        this.setState({ isLoadingGoogleDriveApi: true });
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                () => {
                    console.log(this.setSigninStatus);
                    // Listen for sign-in state changes.
                    gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(this.setSigninStatus);

                    // Handle the initial sign-in state.
                    this.setState({
                        signInStatus: gapi.auth2
                            .getAuthInstance()
                            .isSignedIn.get(),
                    });
                },
                function (error) {}
            );
    }
    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
    }
    listFiles(searchTerm = null) {
        this.setState({ isFetchingGoogleDriveFiles: true });
        //console.log(gapi.client.drive.files);
        gapi.client.drive.files
            .list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
            })
            .then((response) => {
                this.setState({ isFetchingGoogleDriveFiles: false });
                //setListDocumentsVisibility(true);
                const res = JSON.parse(response.body);
                this.setState({ documents: res.files });
            });
    }
    render() {
        //Render time variables
        const isLoggedIn = this.state.isLoggedIn;
        //Not currently being used for theme changes
        // const colorTheme = this.state.selectedColorTheme;

        //View to return if user is logged in
        if (isLoggedIn) {
            return (
                <div>
                    <Header
                        isLoggedIn={isLoggedIn}
                        handleLoginClick={this.handleLogin}
                        handleLogoutClick={this.handleLogout}
                        handleLogout={this.handleLogout}
                    />
                    <Sidenav
                        user={this.state.user}
                        isLoggedIn={isLoggedIn}
                        handleLogin={this.handleLogin}
                        handleLogout={this.handleLogout}
                        handleClientLoad={this.handleClientLoad}
                        handleGoogleSignOutClick={this.handleSignOutClick}
                        googleUser={this.state.googleUser}
                    />
                    <AppBody
                        user={this.state.user}
                        updateUser={this.updateUser}
                        isLoading={this.state.isLoading}
                    />
                    <button
                        className='btn waves-effect waves-light indigo white-text'
                        onClick={this.listFiles}
                        type='button'
                    >
                        List Files
                    </button>
                    <footer className='section footer-tm left'>
                        <p>Constructapedia &copy; &trade; 2020</p>
                    </footer>
                </div>
            );
            //View to return if no user is logged in
        } else {
            return (
                <div>
                    <div className='navbar-fixed nav-bar-override'>
                        <nav className='z-depth-1 indigo lighten-5 nav-bar-override'>
                            <div className='header-width'>
                                <div className='nav-wrapper'>
                                    <a
                                        href='index.html'
                                        className='brand-logo left indigo-text text-darken-3 header-name'
                                    >
                                        <b>Constructapedia</b>
                                    </a>
                                    <div className='nav-wrapper right'>
                                        <a
                                            href='#slide-out'
                                            data-target='slide-out'
                                            className='sidenav-trigger show-on-large indigo-text text-darken-3'
                                        >
                                            <i className='large material-icons header-icon'>
                                                more_horiz
                                            </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <Sidenav
                        isLoggedIn={isLoggedIn}
                        handleLogin={this.handleLogin}
                        handleLogout={this.handleLogout}
                    />
                    <section className='section section-icons grey lighten-4 center'>
                        <div id='app-body-container' className='container'>
                            <div className='row' id='index-banner'>
                                <div className='col s12 m4 offset-m4'>
                                    <div className='card-panel'>
                                        {this.state.isLoading ? (
                                            <Preloader />
                                        ) : (
                                            <a
                                                href='#slide-out'
                                                data-target='slide-out'
                                                className='sidenav-trigger show-on-large'
                                            >
                                                <i className='material-icons large indigo-text text-darken-3'>
                                                    settings_power
                                                </i>
                                                <h5 className='indigo-text text-darken-3'>
                                                    <b>Plan Your Project</b>
                                                </h5>
                                                <p className='blue-grey-text text-lighten-5'>
                                                    (Hold My Beer!)
                                                </p>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className='section footer-tm left'>
                        <p>Constructapedia &copy; &trade; 2020</p>
                    </footer>
                </div>
            );
        }
    }
}

export default App;
