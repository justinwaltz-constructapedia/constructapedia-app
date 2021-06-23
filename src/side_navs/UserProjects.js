import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
//import {getUserPlans} from "../api/projectsApi.js";

function UserProjects(props) {
    const projectsDropdown = useRef(null);

    useEffect(() => {
        M.Collapsible.init(projectsDropdown.current);
    },[]);
    function deleteSubPlan (subPlanTitle) {
        const currentPlan = props.userPlans[props.selectedPlanIndex]
        const currentSubPlans = currentPlan.sub_plans
        const newSubPlans = [];
        for (var i = 0; i < currentSubPlans.length; i++) {
            newSubPlans[i] = currentSubPlans[i]
        }
        //could be simplified with index parameter now
        const indexOfSubPlanToDelete = currentSubPlans.findIndex(subPlan => subPlan.title === subPlanTitle)
        console.log(indexOfSubPlanToDelete);
        newSubPlans.splice(indexOfSubPlanToDelete, 1);
        props.savePlanChanges(currentPlan.id, {sub_plans:newSubPlans});
    }
    return (
        <div className="row">
            <div className="col s12">
                <div className="row center-align">
                    <h5>{props.name}'s Projects</h5>
                    <button className="btn waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" onClick={()=>{props.changeView('search')}}><i className="material-icons left">add</i>Create-A-Project</button>
                </div>
                <div className="divider"></div>
                <h5>Working Project</h5>
                <ul ref={projectsDropdown} className="collapsible collapsible-accordion">
                    {props.userPlans.length > 0 &&
                        props.userPlans.map((plan) => {
                                const subPlans = plan.sub_plans.map((subPlan, i) => {
                                    return (<li key={subPlan.title + i}>
                                                <a href="#subPlan" className="blue-grey darken-4 blue-grey-text text-lighten-4">
                                                    {subPlan.title}
                                                    <i className="material-icons right blue-grey darken-4 blue-grey-text text-darken-3"
                                                        onClick={()=>deleteSubPlan(subPlan.title)}>delete_forever</i>
                                                </a>
                                            </li>)
                                })
                                return (
                                    <li key={plan.id} className="bold">
                                        <div className="collapsible-header">
                                            <h6 className="valign-wrapper" onClick={()=>props.updateSelectedPlan(plan.id)}>{plan.title}<i className="material-icons">chevron_right</i></h6>
<<<<<<< HEAD
                                            <button className="btn-flat waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5" onClick={()=>{props.removeUserPlan(plan.id)}}>
=======
                                            <button className="btn-flat center-alin right waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5" onClick={()=>{props.removeUserPlan(plan.id)}}>
>>>>>>> 4a3ff76f06e337e93d03958c8bb902ac9ae492a6
                                                    <i className="material-icons left blue-grey darken-4 blue-grey-text text-darken-2">delete_forever</i></button>
                                        </div>
                                        <div className="collapsible-body blue-grey darken-4 blue-grey-text text-lighten-5">
                                            <ul>
                                                {subPlans}
                                                <li>

                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default UserProjects;
