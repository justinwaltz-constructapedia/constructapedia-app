//Import React and hooks used
import React, { useState, useEffect, useRef } from 'react';
//Import Materialize functionality
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
//Import Project Components
import Preloader from '../utility_components/Preloader.js';
//Import Functions
import { getUserData } from '../api/userApi.js';
import { postAuthLogin, postAuthSignUp, googleUserLogin } from '../api/authApi';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { withRouter } from "react-router-dom";

//Functional Component
//Handles user sign up and login
function Authorization(props) {
    //Ref hooks
    //Materialize sidenav
    const sidenav = useRef(null);
    //Materialize collapsible
    const authDropdown = useRef(null);
    //State Hooks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [sidenavIsLoading, setSidenavIsLoading] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const responseGoogle = async googleUser => {
        console.log(googleUser);
        const googleUserInfo = {
            client_id:googleUser.googleId,
            client_tokens: googleUser.tokenObj,
            name:googleUser.profileObj.name,
            email:googleUser.profileObj.email
        }
        const res = await googleUserLogin(googleUserInfo, rememberMe);
        // const data = await res.json()
        // console.log(data);
        signUserInToApp(res);
        // const res = await fetch ("", {
        //     method: "POST",
        //     body: JSON.stringify({
        //     token: googleUser.tokenId
        //     }),
        //     headers: {
        //     "Content-Type":"application/json"
        //     }
        //     })

            // based on what we get back we can save the user data accordingly
        // console.log(JSON.stringify(googleUser));
        // const idToken = googleUser.getAuthResponse().id_token;
        // const googleEmail = googleUser.profileObj.email;
        // console.log('The id_token is ' + idToken)
        // localStorage.setItem('access_token', idToken);
        // localStorage.setItem('user_id', googleEmail);
        // props.history.push(props.onLogin);
    };

    const responseGoogleLogout = (response) => {
        console.log('Logout response:' + JSON.stringify(response));
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        console.log('Logged out')
        props.history.push(props.onLogout)
    };
    //Effect Hooks
    //Intitialzes Materialize side nav and collapsible
    //Runs on initial render only
    useEffect(() => {
        const sidenavOptions = {
            inDuration: 250,
            outDuration: 200,
            draggable: true,
            edge: 'right',
        };
        M.Sidenav.init(sidenav.current, sidenavOptions);
        M.Collapsible.init(authDropdown.current);
    }, []);

    //Component functionality
    //Processes changed values for all form elements
    function handleChange(event) {
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        setRememberMe(value);
    }
    //Processes user sign-in
    function signUserInToApp (message) {
        console.log(message);
        if (message === true) {
            setLoginFailed(false);
            //get user data from server
            getUserData()
            .then((user) => {
                console.log(user, ' signed in on server!');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                const instance = M.Sidenav.getInstance(sidenav.current);
                instance.close(0);//Use .destroy() instead?
                //Log user in to the app
                props.handleLogin(message, user);
            })
            .catch((err) => console.log(err));
        } else {
            console.log('failed sign in', message);
            setLoginFailed(true);
        }
        setSidenavIsLoading(false);
    }

    function handleSignIn() {
        setSidenavIsLoading(true);
        //Sign user in to server
        postAuthLogin(email, password, rememberMe)
        .then((res) => {
            signUserInToApp(res);
        }).catch((err) => {
            console.log(err);
        })
        //Maybe a redirect here or in handleLogin to get the /#signInForm out of the URL
    }
    //Processes New User Sign-up
    function handleSignUp() {
        setSidenavIsLoading(true);
        //Create User account server call
        postAuthSignUp(name, email, password).then((success) => {
            if (success === true) {
                //Sign-in using the newly created user account
                handleSignIn();
            } else {
                console.log('failed sign up', success);
            }
        });
    }

    function GoogleLgn() {
        console.log("asdhasdjhv")
        if (localStorage.getItem('googleEmail') == null)
            return (<div>
                <GoogleLogin
                    clientId="50139972732-2rf17no6c3aqkeumvuepi94pi32makrv.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>)
        else {
            console.log('Logged in to Google with' + localStorage.getItem('googleEmail'));
            return (<div>
                <GoogleLogout
                    clientId="50139972732-2rf17no6c3aqkeumvuepi94pi32makrv.apps.googleusercontent.com"
                    buttonText="Logout with Google"
                    onLogoutSuccess={responseGoogleLogout}
                />
            </div>)
        }
    }

    //Return view of this component:
    //Includes forms to sign in and create a new user account
    return (
        <ul ref={sidenav} id='slide-out' className='sidenav'>
            <li>
                <div className='user-view'>
                    <h1 className='indigo-text text-darken-3 center-align sidenav-login-logo'>
                        <b>&#123;C&#125;</b>
                    </h1>
                </div>
            </li>
            <div className='divider'></div>
            <li>
                <ul ref={authDropdown} className='collapsible collapsible-accordion '>
                    <li className='active'>
                        <div className='collapsible-header waves-effect waves-light indigo-text text-darken-3'>
                            Login Ins<i className='material-icons'>arrow_drop_down</i>
                        </div>
                        <div className='collapsible-body'>
                            <form
                                id='signInForm'
                                onSubmit={(e) => {
                                    //add validation
                                    e.preventDefault();
                                    handleSignIn();
                                }}
                            >
                                <div className='input-field'>
                                    <input
                                        id='email'
                                        type='email'
                                        className='white'
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor='email'>Email</label>
                                </div>
                                <div className='input-field'>
                                    <input
                                        id='password'
                                        type='password'
                                        className=''
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor='password'>Password</label>
                                </div>
                                <p className='container'>
                                    <label>
                                        <input
                                            name='rememberMe'
                                            checked={rememberMe}
                                            onChange={handleChange}
                                            type='checkbox'
                                        />
                                        <span>Remember Me</span>
                                    </label>
                                </p>
                                <button
                                    className='btn waves-effect waves-light indigo darken-3 container'
                                    type='submit'
                                    name='action'
                                >
                                    Sign In
                                </button>
                                <br></br>
                                <GoogleLgn />
                                <br></br>
                                <br></br>
                            </form>
                            {sidenavIsLoading && <div className='center'><Preloader /></div>}
                            {loginFailed && <p className='center'>Login failed</p>}
                        </div>
                    </li>
                    <div className='divider'></div>
                    <li>
                        <div className='collapsible-header waves-effect waves-light indigo-text text-darken-3'>
                            Create An Account
                            <i className='material-icons'>arrow_drop_down</i>
                        </div>
                        <div className='collapsible-body'>
                            <form
                                id='signUpForm'
                                onSubmit={(e) => {
                                    console.log(e);
                                    e.preventDefault();
                                    if (password === confirmPassword) {
                                        handleSignUp();
                                    } else {
                                        //Change to something more elegant
                                        alert('Passwords do not match.');
                                    }
                                }}
                            >
                                <div className='input-field'>
                                    <input
                                        id='name'
                                        type='text'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <label htmlFor='name'>Name</label>
                                </div>
                                <div className='input-field'>
                                    <input
                                        id='signUpEmail'
                                        type='email'
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor='signUpEmail'>Email</label>
                                </div>
                                <div className='input-field'>
                                    <input
                                        id='signUpPassword'
                                        type='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor='signUpPassword'>Password</label>
                                </div>
                                <div className='input-field'>
                                    <input
                                        id='confirmPassword'
                                        type='password'
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <label htmlFor='confirmPassword'>Confrim Password</label>
                                </div>
                                <p className='container'>
                                    <label>
                                        <input
                                            name='rememberMeSignUp'
                                            checked={rememberMe}
                                            onChange={handleChange}
                                            type='checkbox'
                                        />
                                        <span>Remember Me</span>
                                    </label>
                                </p>
                                <button
                                    className='btn waves-effect waves-light indigo darken-3 container'
                                    type='submit'
                                    name='action'
                                >
                                    Sign Up
                                </button>
                                <br></br>
                                <br></br>
                            </form>
                            <button
                                className='btn'
                                onClick={async () => {
                                    const res = await googleUserLogin();
                                    console.log(res);
                                }}
                            >
                                Google Signin on server
                            </button>
                            {sidenavIsLoading && <Preloader />}
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    );
}

export default Authorization;
