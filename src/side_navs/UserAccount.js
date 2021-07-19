//import React from 'react';
import React, { useEffect, useRef } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import './side_navs.css';

function UserAccount(props) {
  const sidenav = useRef(null);

  useEffect(() => {
    const sidenavOptions = {
      inDuration: 250,
      outDuration: 200,
      draggable: true,
      edge: 'right',
    };
    M.Sidenav.init(sidenav.current, sidenavOptions);
  });
  return (
    <ul ref={sidenav} id='slide-out' className='sidenav'>
      <li className='center-align'>
        <h1 className='indigo-text text-darken-3 center-align sidenav-logo'>
          <b>&#123;C&#125;</b>
        </h1>
      </li>
      <div className='divider'></div>
      <li>
        <div className='container'>
          <div className='user-view'>
            {/*<div className='row'>
              <div className='col s4 offset-s2'>
                <img className='circle' alt='avatar' src='./user-avatar.jpg' />
  </div>
            </div>*/}
            <a href='#name'>
              <p className='name center sidenav-userName indigo-text text-darken-3'>
                <b>{props.user.name}</b>
              </p>
            </a>
            <a href='#email'>
              <p className='email sidenav-email center indigo-text text-darken-3'>
                {props.user.email}
              </p>
            </a>
            <br></br>
            <br></br>

            <div className='container'>
              <button
                className='waves-effect waves-light btn indigo darken-3 white-text center-align'
                onClick={props.handleLogout}
              >
                <b>Log Out </b>
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
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
