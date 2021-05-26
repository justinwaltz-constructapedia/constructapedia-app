import React from 'react';
import Authorization from './Authorization.js';
import UserAccount from './UserAccount.js';


function Sidenav(props) {
    const isLoggedIn = props.isLoggedIn;

    return (
        <div>
            {(isLoggedIn) ? <UserAccount handleLogout={props.handleLogout}/> : <Authorization handleLogin={props.handleLogin} colorTheme={props.colorTheme}/>}
        </div>
    )
}

export default Sidenav;

/*
    let button;
    if (isLoggedIn){
        button = <a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
    } else {
        button = <a href="#" data-target="slide-out" className="sidenav-trigger btn waves-effect waves-light blue">Get Started</a>
    }

    useEffect(()=>{

    })
*/
