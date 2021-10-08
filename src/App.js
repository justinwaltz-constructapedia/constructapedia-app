//Import React
import React  from 'react';
// Import for useContext
import {PlanProvider} from './PlanContext.js';
//Import Project Components
import Header from './Header.js';
import Sidenav from './side_navs/Sidenav.js';
//import Footer from './Footer.js';
import AppBody from './AppBody.js';
import Preloader from './utility_components/Preloader.js';
//Imported Functions
import { getUserData, putUserUpdate } from './api/userApi';
//Import Style
import { getColorTheme } from './classColorThemeVariables.js';
import './Custom.css';



//Only Class Component in the Application; No Hooks
//"Source of truth" for user info and handling
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.state = {
            isLoggedIn: false,
            isLoading: false,
            user: {},
            selectedColorTheme: getColorTheme('base'),
            isAuthorized: false
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
    updateUser (fieldsToUpdate) {
        this.setState((prevState) => {
            const updatedUserObj = {...prevState.user}
            for (const key in fieldsToUpdate) {
                if (Array.isArray(fieldsToUpdate[key])) {
                    fieldsToUpdate[key].forEach((item) => updatedUserObj[key].push(item));
                } else {
                    updatedUserObj[key] = fieldsToUpdate[key]
                }
            }
            return {
                user: updatedUserObj
            }
        })
        console.log('ln77 user state', this.state.user);
        const dbUpdateObj = {};
        for (const key in fieldsToUpdate) {
            dbUpdateObj[key] = this.state.user[key]
        }
        console.log('App ln 82', dbUpdateObj);
        putUserUpdate(dbUpdateObj)
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
                    <PlanProvider>
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
                        <AppBody
                            user={this.state.user}
                            updateUser={this.updateUser}
                            isLoading={this.state.isLoading}
                            updateUser={this.updateUser}
                        />
                    </PlanProvider>
                    <footer className='section footer-tm left'>
                        <p>Constructapedia &copy; &trade; 2020</p>
                    </footer>
                </div>
            );
            //View to return if no user is logged in
            //DEV NOTE :: the header and sidenav components could probaly just be reused as they are no different at this point
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
/*<button
    className='btn waves-effect waves-light indigo white-text'
    onClick={this.listFiles}
    type='button'
>
    List Files
</button>*/
// <div className="container">
//     <button
//         className='btn waves-effect waves-light indigo white-text'
//         onClick={this.handleSignOutClick}
//         type='button'
//     >
//         Sign Out Google Drive
//     </button>
// </div>
// <div className="container">
//     <button
//         className='btn waves-effect waves-light indigo white-text'
//         onClick={()=>this.handleClientLoad()}
//         type='button'
//     >
//         Link Google Drive
//     </button>
// </div>
