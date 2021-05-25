import React from 'react';
function Header (props) {

    return (
        <header>
            <nav className="top-nav blue z-depth-0">
                <div className="nav-wrapper">
                    <a href="index.html" className="brand-logo center">Contruct-A-Project</a>
                    <ul className="right">
                        <li><a href="#slide-out" data-target="slide-out" className="sidenav-trigger white-text show-on-large"><i className="large material-icons">account_circle</i></a></li>
                    </ul>
                </div>
            </nav>
            <div className="container">
                <a href="#" data-target="project-nav" className="top-nav sidenav-trigger full hide-on-large-only"><i className="medium material-icons">view_list</i></a>
            </div>
        </header>
    )
}

export default Header;

/*
function handleLoginClick(e){
    e.preventDefault();
    props.handleLoginClick(true);
}
function handleLogoutClick(e){
    props.handleLogoutClick(false);
}
const isLoggedIn = props.isLoggedIn;
let button;
if (isLoggedIn){
    button = <LogoutButton onClick={handleLogoutClick} />
} else {
    button = <LoginButton onClick={handleLoginClick} />
}

function LoginButton(props) {
    return (
        <a href="#" id="download-button" className="btn waves-effect waves-light blue" onClick={props.onClick}>Get Started</a>
    )
}
function LogoutButton(props) {
    return (
        <a href="#" id="download-button" className="btn waves-effect waves-light blue" onClick={props.onClick}>Log Out</a>
    )
}
 */
