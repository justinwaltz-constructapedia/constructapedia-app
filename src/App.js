import React from 'react';
import Header from './Header.js';
import Sidenav from './side_navs/Sidenav.js';
//import Footer from './Footer.js';
import AppBody from './AppBody.js';
import Preloader from './utility_components/Preloader.js';
import { getUserData } from './api/userApi';
import { getColorTheme } from './classColorThemeVariables.js';
import './Custom.css';

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
    };
  }
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
    console.log(this.state.selectedColorTheme);
  }

  updateUser(userObj) {
    this.setState({ user: userObj });
  }
  handleLogin(isLoggedIn, user) {
    this.setState({ isLoggedIn: isLoggedIn });
    this.setState({ user: user });
    console.log(this.state.user.name, 'is logged in to app');
    //console.log(localStorage);
  }

  handleLogout() {
    localStorage.clear();
    window.location.reload(false);
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const colorTheme = this.state.selectedColorTheme;
    //Probably need to refactor so there is only one render method

    if (!isLoggedIn) {
      return (
        <div>
          <div className='navbar-fixed'>
            <nav className='z-depth-1 white'>
              <div>
                <div className='nav-wrapper white'>
                  <div className='container'>
                    <a
                      href='index.html'
                      className='brand-logo left indigo-text text-darken-3 white'
                    >
                      <b>Constructapedia</b>
                    </a>
                    <ul className='right'>
                      <li>
                        <a
                          href='#slide-out'
                          data-target='slide-out'
                          className='sidenav-trigger show-on-large indigo-text text-darken-3'
                        >
                          <i className='large material-icons'>more_horiz</i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <Sidenav
            isLoggedIn={isLoggedIn}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            colorTheme={colorTheme}
          />

          <section className='section section-icons grey lighten-4 center'>
            <div id='app-body-container' className='container'>
              <div className='row' id='index-banner'>
                <div clasName='col s12 m4'>
                  <div className='card-panel'>
                    {this.state.isLoading ? (
                      <Preloader />
                    ) : (
                      <a
                        href='#slide-out'
                        data-target='slide-out'
                        className='sidenav-trigger show-on-large'
                      >
                        <i class='material-icons large indigo-text text-darken-3'>
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

          <footer class='section footer-tm right'>
            <p>Contructapedia &copy; &trade; 2021</p>
          </footer>
        </div>
      );
    } else {
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
          <AppBody
            user={this.state.user}
            updateUser={this.updateUser}
            isLoading={this.state.isLoading}
          />
          <footer className='page-footer blue-grey darken-4 blue-grey-text text-lighten-5'>
            <div className='footer-copyright'>
              <div className='container'>© 2021 Copyright Text</div>
            </div>
            <div className='container'></div>
          </footer>
        </div>
      );
    }
  }
}

export default App;
