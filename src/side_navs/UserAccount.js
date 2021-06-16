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
        <ul ref={sidenav} id="slide-out" className="sidenav blue-grey darken-4 blue-grey-text text-lighten-5">
            <li className="center-align blue-grey darken-4 blue-grey-text text-lighten-5 section">
                <h5 className="no-margin">User Account</h5>
            </li>
            <li>
                <div className="container">
                    <div className="user-view">
                        <div className="row">
                            <div className="col s4 offset-s2">
                                <img className="circle" alt="avatar" src="./user-avatar.jpg"/>
                            </div>
                        </div>
                        <a href="#name"><span className="name blue-grey darken-4 blue-grey-text text-lighten-5">{props.user.name}</span></a>
                        <a href="#email"><span className="email blue-grey darken-4 blue-grey-text text-lighten-5">{props.user.email}</span></a>
                        <button className="waves-effect waves-light btn blue-grey darken-4 blue-grey-text text-lighten-5" onClick={props.handleLogout}>Log Out</button>
                    </div>
                </div>
            </li>


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
