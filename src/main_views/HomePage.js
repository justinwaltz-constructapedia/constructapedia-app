import React from 'react';
import './HomePage.css';

function HomePage(props) {
  return (
    <div className='row'>
      <div className='col s12'>
        <div className='container create-prj-container'>
          <button
            className='btn waves-effect waves-light indigo darken-4 white-text'
            onClick={() => {
              props.handleMainAppView('NewProject');
            }}
          >
            <i className='material-icons left'>add</i>
            <b>Create-A-Project</b>
          </button>
        </div>
        <ul id='home-page-nav' className='collection with-header'>
          <div>
            <li className='collection-header'></li>
          </div>
          <div className='divider'></div>
          <li className='collection-header blue-grey darken-4 blue-grey-text text-lighten-5'>
            <b>Working Projects</b>
          </li>
          {props.userPlans.length > 0 &&
            props.userPlans.map((plan) => {
              return (
                <li
                  key={plan.id}
                  className='collection-item blue-grey darken-4'
                >
                  <div className='blue-grey darken-4 blue-grey-text text-lighten-5'>
                    <a
                      href='#notebook'
                      className='waves-effect waves-light btn-flat white-text'
                      onClick={() => props.updateSelectedPlan(plan.id)}
                    >
                      <h6 className='valign-wrapper'>
                        {plan.title}
                        <i className='material-icons'>chevron_right</i>
                      </h6>
                    </a>

                    <button
                      className='btn-flat center-align right waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5 hide-on-small-and-down '
                      onClick={() => {
                        props.removeUserPlan(plan.id);
                      }}
                    >
                      <i className='material-icons left blue-grey darken-4 blue-grey-text text-darken-2'>
                        delete_forever
                      </i>
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
export default HomePage;

/*
const projectNav = useRef(null);
ref={projectNav}
className="sidenav sidenav-fixed z-depth-0
useEffect(() => {
    const projectNavOptions = {
        inDuration: 250,
        outDuration: 200,
        draggable: true
    };
    M.Sidenav.init(projectNav.current, projectNavOptions);
},[]);
<UserProjects
    userPlans={props.userPlans}
    selectedPlanIndex={props.selectedPlanIndex}
    changeView={changeView}
    handleMainAppView={props.handleMainAppView}
    updateSelectedPlan={props.updateSelectedPlan}
    updateUserPlans={props.updateUserPlans}
    removeUserPlan={props.removeUserPlan}
    savePlanChanges={props.savePlanChanges}/>
 */
