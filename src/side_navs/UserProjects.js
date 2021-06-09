import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
//import {getUserPlans} from "../api/projectsApi.js";

function UserProjects(props) {
    const projectsDropdown = useRef(null);

    useEffect(() => {
        M.Collapsible.init(projectsDropdown.current);
    },[]);

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
                                const subPlans = plan.sub_plans.map((subPlan, i) => {
                                    return <li key={subPlan.title + i}><a href="#subPlan">{subPlan.title}</a></li>
                                })
                                return (
                                    <li key={plan.id} className="bold">
                                        <div className="collapsible-header">
                                            <h6 className="valign-wrapper" onClick={()=>props.updateSelectedPlan(plan.id)}>{plan.title}<i className="material-icons">chevron_right</i></h6>
                                        </div>
                                        <div className="collapsible-body">
                                            <ul>
                                                {subPlans}
                                                <li>
                                                    <button className="btn waves-effect waves-light blue" onClick={()=>{props.removeUserPlan(plan.id)}}>
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
