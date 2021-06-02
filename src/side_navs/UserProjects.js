import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import {deletePlan} from "../api/projectsApi.js";

function UserProjects(props) {
    const projectsDropdown = useRef(null);

    useEffect(() => {
        M.Collapsible.init(projectsDropdown.current);
    },[]);

    function selectPlan(id){
        const selectedPlan = props.userPlans.find(plan => plan.id === id);
        console.log(selectedPlan)
        props.changeOrUpdatePlanDraft(selectedPlan);
        props.handleMainAppView('ProjectDetails');
    }
    function deleteSelectedPlan(planId){
        deletePlan(planId).then((res) => {
            //Update the list of projects
            //if plan Id is same as current plan then clear the main view
            console.log(res);
        })
    }
    return (
        <div className="row">
            <div className="col s12">
                <div className="row center-align">
                    <h5>{props.name}'s Projects</h5>
                    <button className="btn waves-effect waves-light blue" onClick={()=>{props.changeView('search')}}><i className="material-icons left">add</i>New Project</button>
                </div>
                <ul ref={projectsDropdown} className="collapsible collapsible-accordion">
                    {props.userPlans.length > 0 &&
                        props.userPlans.map((plan) => {
                                const subPlans = plan.sub_plans.map((subPlan) => {
                                    return <li><a href="#subPlan" key={subPlan.title}>{subPlan.title}</a></li>
                                })
                                return (
                                    <li key={plan.id} className="bold">
                                        <div className="collapsible-header">
                                            <h6 className="valign-wrapper" onClick={()=>selectPlan(plan.id)}>{plan.title}<i className="material-icons">chevron_right</i></h6>
                                        </div>
                                        <div className="collapsible-body">
                                            <ul>
                                                {subPlans}
                                                <li>
                                                    <button className="btn waves-effect waves-light blue" onClick={()=>{props.deleteSelectedPlan(plan.id)}}>
                                                            <i className="material-icons left">delete_forever</i>Delete Project</button>
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
