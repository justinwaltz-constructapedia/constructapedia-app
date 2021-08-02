import React from 'react';
//Import Project Components
import Authorization from './Authorization.js';
import UserAccount from './UserAccount.js';

//Renders what should be showing up in the sidenav
function Sidenav(props) {
//Return view of this component:
    //Includes sign in/up or account info based on state of App
    return (
        <div>
            {(props.isLoggedIn)
                ? <UserAccount user={props.user} handleLogout={props.handleLogout}/>
                : <Authorization handleLogin={props.handleLogin} colorTheme={props.colorTheme}/>}
        </div>
    )
}
export default Sidenav;
