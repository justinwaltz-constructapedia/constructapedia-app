import React, { useEffect, useRef } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
//import SelectedPlanNav from './SelectedPlanNav.js';

function PlanDetailsMenu(props) {
  const addMenuDropdown = useRef(null);

  useEffect(() => {
    M.Collapsible.init(addMenuDropdown.current);
  }, []);

  return (
    <div className='row'>
      <ul
        id='sticky-project-nav'
        className='col s3 push-s9 center-align collection with-header grey lighten-5'
      >
        <li className='collection-header center indigo-text grey lighten-5'>
          <b>&#123;C&#125;</b>

          {/*<SelectedPlanNav
                  selectedPlan={props.userPlans[props.selectedPlanIndex]}
                  handleMainAppView={props.handleMainAppView}
                  updateSelectedPlan={props.updateSelectedPlan}
                  removeUserPlan={props.removeUserPlan}
                  savePlanChanges={props.savePlanChanges}
                  />
              <div className="divider"></div>*/}
          <li className='collection-item indigo'>
            <div className=''>
              <a
                id='add-substep-btn'
                href='#add-modal'
                className='white-text'
                onClick={(e) => props.openAddModal(e)}
              >
                + Work Step
              </a>
            </div>
          </li>
          <li
            className='collection-item indigo '
            onclick={(e) => props.openAddModal(e)}
          >
            <div>
              <a
                id='add-checklist-btn'
                href='#add-modal'
                className='white-text'
                onClick={(e) => props.openAddModal(e)}
              >
                + Checklist
              </a>
            </div>
          </li>
          <li className='collection-item grey lighten-2'>
            <a
              id='add-folder-btn'
              href='#add-modal'
              className='grey-text'
              onClick={(e) => alert('Not ready yet Zach!')}
            >
              + Pictures
            </a>
          </li>
        </li>
      </ul>
    </div>
  );
}
export default PlanDetailsMenu;

/*
const projectNav = useRef(null);
useEffect(() => {
    const projectNavOptions = {
        inDuration: 250,
        outDuration: 200,
        draggable: true
    };
    M.Sidenav.init(projectNav.current, projectNavOptions);
},[]);
ref={projectNav} className="sidenav sidenav-fixed z-depth-0

*/
