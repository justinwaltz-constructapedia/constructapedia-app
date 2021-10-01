//Import React and hooks used
import React, { useEffect, useRef } from 'react';
//Import Materialize functionality
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
//Import style
import './side_navs.css';

//Functional Component
    //Handles the user account view of the side nav menu
function UserAccount(props) {
//Ref hook for Materialize Sidenav
  const sidenav = useRef(null);
//Effect Hooks
    //Intitialzes Materialize side nav
    useEffect(() => {
        const sidenavOptions = {
            inDuration: 250,
            outDuration: 200,
            draggable: true,
            edge: 'right',
        };
        M.Sidenav.init(sidenav.current, sidenavOptions);
    });

//Return view of this component:
    //Includes Account info/settings and log out
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
            <li>
                <div className='section'>
                    <h6 className='indigo-text text-darken-3 center-align'>Linked Accounts</h6>

                        {/*// <div className="container">
                        //     <button
                        //         className='btn waves-effect waves-light indigo white-text'
                        //         onClick={props.handleGoogleSignOutClick}
                        //         type='button'
                        //     >
                        //         Sign Out Google Drive
                        //     </button>
                        // </div>
                        // <div className="container">
                        //     <button
                        //         className='btn waves-effect waves-light indigo white-text'
                        //         onClick={props.handleClientLoad}
                        //         type='button'
                        //     >
                        //         Link Google Drive
                        //     </button>
                        // </div>*/}

                </div>
            </li>
        </ul>
    );
}
export default UserAccount;

// { (props.googleUser)?():() }
// const UserCard = (props) => {
//   return (
//     <div>
//       <h2>{props.user.name}</h2>
//       <img src={props.user.profileImg} alt="user profile" />
//     </div>
//   );
// }
//

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

  // //OAuth for Google Drive API
  //     //Initial Render
  // useEffect(() => {
  //     const setAuth2 = async () => {
  //       const auth2 = await loadAuth2(gapi, process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID, 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
  //       if (auth2.isSignedIn.get()) {
  //           updateUser(auth2.currentUser.get())
  //       } else {
  //           attachSignin(document.getElementById('customBtn'), auth2);
  //       }
  //     }
  //     setAuth2();
  // }, []);
  //     //When googleUser changes
  // useEffect(() => {
  //     if (!googleUser) {
  //       const setAuth2 = async () => {
  //         const auth2 = await loadAuth2(gapi, process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID, 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
  //         attachSignin(document.getElementById('customBtn'), auth2);
  //       }
  //       setAuth2();
  //     }
  // }, [googleUser])
  // //Google Drive Functions
  // const updateUser = (currentUser) => {
  //     console.log(currentUser);
  //     const name = currentUser.getBasicProfile().getName();
  //     const profileImg = currentUser.getBasicProfile().getImageUrl();
  //     setGoogleUser({
  //         name: name,
  //         profileImg: profileImg,
  //     });
  // };
  //
  // const attachSignin = (element, auth2) => {
  //   auth2.attachClickHandler(element, {},
  //     (googleDriveUser) => {
  //       updateUser(googleDriveUser);
  //     }, (error) => {
  //     console.log(JSON.stringify(error))
  //   });
  // };
  //
  // const signOut = () => {
  //   const auth2 = gapi.auth2.getAuthInstance();
  //   auth2.signOut().then(() => {
  //     setGoogleUser(null);
  //     console.log('User signed out.');
  //   });
  // }
