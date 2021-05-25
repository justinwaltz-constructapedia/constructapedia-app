import React from 'react';
import Header from './Header.js';
import Sidenav from './side_navs/Sidenav.js'
import Footer from './Footer.js';
import AppBody from './AppBody.js';
import Preloader from './utility_components/Preloader.js';
import {getUserData} from './api/userApi';

class App extends React.Component {
    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.state = {
            isLoggedIn: false,
            isLoading: false,
            user: {}
        };
    }
    componentDidMount() {
        console.log(localStorage)
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe){
            this.setState({isLoading: true});
            getUserData()
            .then((userData) => {
                this.handleLogin(true, userData);
                this.setState({isLoading: false})
            })
            .catch((err) => {
                console.log(err)
            })

        }
    }

    updateUser(userObj){
        this.setState({user:userObj});
    }
    handleLogin(isLoggedIn, user){
        this.setState({isLoggedIn: isLoggedIn});
        this.setState({user: user});
        console.log(this.state.user.name, "is logged in to app");
        //console.log(localStorage);
    }

    handleLogout () {
        localStorage.clear();
        window.location.reload(false);
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
//Probably need to refactor so there is only one render method
        //this.handleLogout()
        if (!isLoggedIn){
            return (
                <div>
                    <nav className="top-nav blue z-depth-0">
                        <div className="nav-wrapper">
                            <a href="index.html" className="brand-logo center">Contruct-A-Project</a>
                            <ul className="right">
                                <li><a href="#slide-out" data-target="slide-out" className="sidenav-trigger white-text show-on-large"><i className="large material-icons">account_circle</i></a></li>
                            </ul>
                        </div>
                    </nav>
                    <Sidenav isLoggedIn={isLoggedIn} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>
                    <div id="app-body-container" className="container">
                        <div className="section no-pad-bot center-align" id="index-banner">
                            { this.state.isLoading ? <Preloader /> : <h5>Sign up or log in to start planning.</h5> }
                        </div>
                    </div>
                    <Footer />
                </div>
            );
        } else {
            return (
                <div>
                    <Header isLoggedIn={isLoggedIn}
                            handleLoginClick={this.handleLogin}
                            handleLogoutClick={this.handleLogout}
                            handleLogout={this.handleLogout}/>
                    <Sidenav isLoggedIn={isLoggedIn} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>
                    <AppBody
                        user={this.state.user}
                        updateUser={this.updateUser}
                        isLoading={this.state.isLoading}/>
                    <Footer />
                </div>
            );
        }
    }
}

export default App;
