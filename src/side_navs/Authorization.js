import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import Preloader from "../utility_components/Preloader.js";
import {getUserData} from '../api/userApi.js';
import {postAuthLogin, postAuthSignUp} from '../api/authApi';


function Authorization(props) {
    const sidenav = useRef(null);
    const signUpDropdown = useRef(null);
    const authDropdown = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [sidenavIsLoading, setSidenavIsLoading] = useState(false);

    useEffect(() => {
        const sidenavOptions = {
            inDuration: 250,
            outDuration: 200,
            draggable: true,
            edge: 'right'
        };
        M.Sidenav.init(sidenav.current, sidenavOptions);
        M.Collapsible.init(signUpDropdown.current);
        M.Collapsible.init(authDropdown.current);
    },[]);

    function handleChange (event) {
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        //this.setState({ [input.name]: value });
        setRememberMe(value);
    };
    function handleSignIn() {
        setSidenavIsLoading(true);
        postAuthLogin(email, password, rememberMe).then((success) => {
            console.log(success);
            if (success === true) {
                getUserData()
                .then((user) => {
                    console.log(user, " signed in on server!")
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setName("");
                    const instance = M.Sidenav.getInstance(sidenav.current);
                    //Use .destroy() instead?
                    instance.close(0);
                    props.handleLogin(success, user);
                })
                .catch(err => console.log(err))
            } else {
                console.log("failed sign in", success);
            }
            setSidenavIsLoading(false);
        })
        //Maybe a redirect here or in handleLogin to get the /#signInForm out of the URL
    }
    function handleSignUp(){
        setSidenavIsLoading(true);
        postAuthSignUp(name,email,password).then((success) => {
            if (success === true) {
                handleSignIn();
            } else {
                console.log("failed sign up", success);
            }
        })
    }

    return (
        <ul ref={sidenav} id="slide-out" className={`sidenav ${props.colorTheme.primary}`}>
            <li>
                <div className="user-view center-align">
                  <a href="index.html"><img src="http://via.placeholder.com/120x120" alt="Logo" /></a>
                  <h4 className="center-align">Sign Up/Login</h4>
                </div>
            </li>
            <li><div className="divider"></div></li>
            <li>
                <ul ref={authDropdown} className="collapsible collapsible-accordion">
                    <li className="active white">
                        <div className="collapsible-header waves-effect waves-light blue">Existing Users<i className="material-icons">arrow_drop_down</i></div>
                        <div className="collapsible-body container white">
                            <form id="signInForm" onSubmit={(e)=> {
                                //add validation
                                e.preventDefault();
                                handleSignIn();
                            }}>
                                <div className="input-field">
                                    <input id="email" type="email" className="validate" onChange={(e)=> setEmail(e.target.value)} />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-field">
                                    <input id="password" type="password" className="validate" onChange={(e)=> setPassword(e.target.value)} />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <p>
                                    <label>
                                        <input name="rememberMe" checked={rememberMe} onChange={handleChange} type="checkbox" />
                                        <span>Remember Me</span>
                                    </label>
                                </p>
                                <button className="btn waves-effect waves-light blue" type="submit" name="action">Sign In</button>
                            </form>
                            {sidenavIsLoading && <Preloader/>}
                        </div>
                    </li>
                    <li className="white">
                        <div className="collapsible-header waves-effect waves-light blue">Create New Account<i className="material-icons">arrow_drop_down</i></div>
                        <div className="collapsible-body container white">
                            <form id="signUpForm" onSubmit={(e)=> {
                                    console.log(e)
                                    e.preventDefault();
                                if (password === confirmPassword) {
                                    handleSignUp();
                                } else {
                            //Change to something more elegant
                                    alert ("Passwords do not match.");
                                }
                            }}>
                                <div className="input-field">
                                    <input id="name" type="text" className="validate" onChange={(e)=> setName(e.target.value)} />
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className="input-field">
                                    <input id="signUpEmail" type="email" className="validate" onChange={(e)=> setEmail(e.target.value)} />
                                    <label htmlFor="signUpEmail">Email</label>
                                </div>
                                <div className="input-field">
                                    <input id="signUpPassword" type="password" className="validate" onChange={(e)=> setPassword(e.target.value)} />
                                    <label htmlFor="signUpPassword">Password</label>
                                </div>
                                <div className="input-field">
                                    <input id="confirmPassword" type="password" className="validate" onChange={(e)=> setConfirmPassword(e.target.value)} />
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                </div>
                                <p>
                                    <label>
                                        <input name="rememberMeSignUp" checked={rememberMe} onChange={handleChange} type="checkbox" />
                                        <span>Remember Me</span>
                                    </label>
                                </p>
                                <button className="btn waves-effect waves-light blue" type="submit" name="action">Sign Up</button>
                            </form>
                            {sidenavIsLoading && <Preloader/>}
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    )
}

export default Authorization;
