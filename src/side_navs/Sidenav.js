import React, {useState} from 'react';
import Authorization from './Authorization.js';
import UserAccount from './UserAccount.js';

function Sidenav(props) {
    const isLoggedIn = props.isLoggedIn;
    const sidenavIsLoading = useState(false);
    if (!sidenavIsLoading) {
        return (
            <div>
                {(isLoggedIn) ? <UserAccount handleLogout={props.handleLogout}/> : <Authorization handleLogin={props.handleLogin}/>}
            </div>
        )
    } else {
        //add in Preloader with ul and id etc (maybe best in other file)
        return (
            <div></div>
        )
    }

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
