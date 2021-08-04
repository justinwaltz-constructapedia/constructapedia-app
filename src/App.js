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
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
//https://accounts.google.com/o/oauth2/iframerpc?action=listSessions&client_id=50139972732-2rf17no6c3aqkeumvuepi94pi32makrv.apps.googleusercontent.com&origin=http%3A%2F%2Flocalhost%3A3000&scope=openid%20profile%20email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.files&ss_domain=http%3A%2F%2Flocalhost%3A3000

//Only Class Component in the Application; No Hooks
    //"Source of truth" for user info and handling
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleClientLoad = this.handleClientLoad.bind(this);
        this.updateSigninStatus = this.updateSigninStatus.bind(this);
        this.handleSignOutClick = this.handleSignOutClick.bind(this);
        this.initClient = this.initClient.bind(this);
        this.state = {
            isLoggedIn: false,
            isLoading: false,
            user: {},
            selectedColorTheme: getColorTheme('base'),
            isLoadingGoogleDriveApi: false,
            googleDriveUser: null
        };
    }
//Life Cycle Methods
    componentDidMount() {
        //this.handleLogout()
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
    handleAuthClick (event) {
        gapi.auth2.getAuthInstance().signIn();
    };

    /**
    *  Called when the signed in status changes, to update the UI
    *  appropriately. After a sign-in, the API is called.
    */
    updateSigninStatus (isSignedIn) {
        if (isSignedIn) {
            // Set the signed in user
            this.setState({googleDriveUser: gapi.auth2.getAuthInstance().currentUser.je.Qt});
            this.setState({isLoadingGoogleDriveApi:false});
            // list files if user is authenticated
            // listFiles();
            console.log("signed in to drive");
        } else {
            // prompt user to sign in
            this.handleAuthClick();
        }
    };

    /**
    *  Sign out the user upon button click.
    */
    handleSignOutClick (event) {
        // setListDocumentsVisibility(false);
        gapi.auth2.getAuthInstance().signOut();
        console.log("signed out of google drive");
    };
    /**
     * Initializes the API client library and sets up sign-in state listeners.
     */
    initClient () {
        this.setState({isLoadingGoogleDriveApi:true});
        gapi.client
            .init({
             apiKey: API_KEY,
             clientId: CLIENT_ID,
             discoveryDocs: DISCOVERY_DOCS,
             scope: SCOPES,
            })
            .then(() => {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus());

                    // Handle the initial sign-in state.
                    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                },
                function (error) {}
            );
    };

    handleClientLoad () {
        gapi.load('client:auth2', this.initClient);
    };
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
                    />
                    <button onClick={this.handleClientLoad}>Link Google Drive</button>
                    <AppBody
                        user={this.state.user}
                        updateUser={this.updateUser}
                        isLoading={this.state.isLoading}
                    />
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
                            <div className='nav-wrapper'>
                                <div className='container'>
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
                                            <i className='large material-icons header-icon'>more_horiz</i>
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
                                        {this.state.isLoading ?
                                            (<Preloader />)
                                            :
                                            (<a
                                                href='#slide-out'
                                                data-target='slide-out'
                                                className='sidenav-trigger show-on-large'
                                            >
                                                <i className='material-icons large indigo-text text-darken-3'>settings_power</i>
                                                <h5 className='indigo-text text-darken-3'>
                                                    <b>Plan Your Project</b>
                                                </h5>
                                                <p className='blue-grey-text text-lighten-5'>(Hold My Beer!)</p>
                                            </a>)
                                        }
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
