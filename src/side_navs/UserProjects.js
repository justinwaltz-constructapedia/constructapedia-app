import React from 'react';

function UserProjects(props) {
    const plans = props.userPlans;

    const plansList = plans.map((plan) => {
            return (
                <li key={plan.id} className="bold">
                    <div className="collapsible-header">
                        <h6 className="valign-wrapper" onClick={()=>selectPlan(plan.id)}>{plan.title} <i className="material-icons">chevron_right</i></h6>
                    </div>
                    <div className="collapsible-body">
                        <ul>
                            <li>Major Project Steps</li>
                        </ul>
                    </div>
                </li>
            )
    })
    function selectPlan(id){
        const selectedPlan = plans.find(plan => plan.id === id);
        console.log(selectedPlan)
        props.changeOrUpdatePlanDraft(selectedPlan);
        props.handleMainAppView('ProjectDetails');
    }
    return (
        <div className="row">
            <div className="col s12">
                <div className="row center-align">
                    <h5>{props.name}'s Projects</h5>
                    <button className="btn waves-effect waves-light blue" onClick={()=>{props.changeView('search')}}><i className="material-icons left">add</i>New Project</button>
                </div>
                <ul className="collapsible collapsible-accordion">
                    {plansList}
                </ul>
            </div>
        </div>
    )
}

export default UserProjects;
