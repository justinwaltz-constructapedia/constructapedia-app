import React from 'react';
import './HomePage.css';

function HomePage(props) {
  return (
    <div className='row'>
      <div className='col s12'>
        <div className='container create-prj-override'>
          <button
            className='btn waves-effect waves-light indigo white-text'
            onClick={() => {
              props.handleMainAppView('NewProject');
            }}
          >
            <b>&#123;C&#125; - Construct-A-Project</b>
          </button>
        </div>
        <ul id='home-page-nav' className='collection with-header'>
          <div>
            <li className='collection-header center grey lighten-5 indigo-text text-darken-3'>
              <b>Projects</b>
            </li>
          </div>

          <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
            <b>In Progress</b>

            {props.userPlans.length > 0 &&
              props.userPlans.map((plan) => {
                return (
                  <li key={plan.id} className='collection-item'>
                    <div className='indigo-text text-darken-3'>
                      <a
                        href='#notebook'
                        className='waves-effect waves-light btn-flat indigo-text text-darken-3'
                        onClick={() => props.updateSelectedPlan(plan.id)}
                      >
                        <h6 className='valign-wrapper'>
                          {plan.title}
                          <i className='material-icons'>chevron_right</i>
                        </h6>
                      </a>

                      <button
                        className='btn-flat center-align right waves-effect waves-light  hide-on-small-and-down '
                        onClick={() => {
                          props.removeUserPlan(plan.id);
                        }}
                      >
                        <i className='material-icons grey-text text-lighten-4'>
                          delete_forever
                        </i>
                      </button>
                    </div>
                  </li>
                );
              })}
          </li>
          <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
            <b>Finished</b>
            <li className='collection-item'>
              Coming Soon <i className='material-icons'>share</i>
            </li>
          </li>
        </ul>
        <ul id='home-page-nav' className='collection with-header'>
          <div>
            <li className='collection-header center grey lighten-5 indigo-text text-darken-3'>
              <b>Construct-A-Network</b>
            </li>
          </div>

          <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
            <b>
              Coming Soon <i className='material-icons'>share</i>
            </b>
          </li>
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
