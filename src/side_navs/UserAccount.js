//import React from 'react';
import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function UserAccount(props) {
    const sidenav = useRef(null);

     useEffect(() => {
         const sidenavOptions = {
             inDuration: 250,
             outDuration: 200,
             draggable: true,
             edge: 'right'
         };
         M.Sidenav.init(sidenav.current, sidenavOptions);
     });
    return (
        <ul ref={sidenav} id="slide-out" className="sidenav">
        <div className="container">
            <li>
                <div className="user-view">
                    <a href="#user"><img className="circle" alt="avatar" src="images/yuna.jpg"/></a>
                    <a href="#name"><span className="name">User Account</span></a>
                    <a href="#email"><span className="email">jdandturk@gmail.com</span></a>
                    <button className="waves-effect waves-light btn blue" onClick={props.handleLogout}>Log Out</button>
                </div>
            </li>

        </div>
        </ul>
    )
}

export default UserAccount;
/*
<li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
<li><a href="#!">Second Link</a></li>
<li><div className="divider"></div></li>
<li><a className="subheader">Subheader</a></li>
<li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
 */

 /*
 <form onSubmit={this.handleSubmit}>
         <label htmlFor="textarea1">
             Project Steps:
             <textarea value={this.state.value} onChange={this.handleChange} id="textarea1" className="materialize-textarea" />
         </label>
         <button className="btn waves-effect waves-light blue" type="submit" name="action">Save</button>
 </form>
  */
