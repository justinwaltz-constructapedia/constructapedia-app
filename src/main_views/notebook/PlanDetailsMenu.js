import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
//import SelectedPlanNav from './SelectedPlanNav.js';

function PlanDetailsMenu(props){
    const addMenuDropdown = useRef(null);

    useEffect(() => {
        M.Collapsible.init(addMenuDropdown.current);
    }, [])

    return (

          <ul id="sticky-project-nav" className="col s3 push-s9 center-align blue-grey darken-4 blue-grey-text text-lighten-5">
              <h5 className="center-align"><b>&#123;C&#125;</b></h5>
              {/*<SelectedPlanNav
                  selectedPlan={props.userPlans[props.selectedPlanIndex]}
                  handleMainAppView={props.handleMainAppView}
                  updateSelectedPlan={props.updateSelectedPlan}
                  removeUserPlan={props.removeUserPlan}
                  savePlanChanges={props.savePlanChanges}
                  />
              <div className="divider"></div>*/}
              <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                  <a id="add-substep-btn" href="#add-modal"
                      className="waves-effect waves-blue btn valign-wrapper blue blue-grey-text text-lighten-5"
                      onClick={(e)=> props.openAddModal(e)}>Work Steps<i className="material-icons left">add</i>
                  </a>
              </div>
              <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                  <a id="add-checklist-btn" href="#add-modal"
                      className="waves-effect waves-blue btn blue blue-grey-text text-lighten-5"
                      onClick={(e)=> props.openAddModal(e)}>Checklist <i className="material-icons left">add</i>
                  </a>
              </div>
              <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                  <a id="add-folder-btn" href="#add-modal"
                      className="btn disabled"
                      onClick={(e)=> alert("Not ready yet Zach!")}>Attach File<i className="material-icons left">add</i>
                  </a>
              </div>
          </ul>

    )
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
