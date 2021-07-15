import React, {useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function SelectedPlanMenu(props) {
    const planDropdown = useRef(null);

    useEffect(() => {
        M.Collapsible.init(planDropdown.current);
    },[]);

    function deleteSubPlan (subPlanTitle) {
        const currentPlan = props.selectedPlan
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
            <div className="table-of-contents col s12">
                <div className="row center-align">
                    <h5>Working Project</h5>
                </div>
                <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                    <div className="col s10">
                        <a href={"#main"} className="col s9 blue-grey darken-4 blue-grey-text text-lighten-4">
                            <h6 className="valign-wrapper sub-plan-link">{props.selectedPlan.title}<i className="material-icons">arrow_upward</i></h6>
                        </a>
                    </div>
                    <div className="col s2">
                        <button className="btn-flat center-align right waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5"
                                onClick={()=>{props.removeUserPlan(props.selectedPlan.id)}}>
                            <i className="material-icons left blue-grey darken-4 blue-grey-text text-darken-2">delete_forever</i>
                        </button>
                    </div>
                </div>
                <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                    <div className="col hide-on-small-only m12 l12">
                        <ul id="sub-step-collapsible" ref={planDropdown} className="z-depth-0 collapsible collapsible-accordion no-border">
                            {props.selectedPlan.sub_plans &&
                                props.selectedPlan.sub_plans.map((subPlan, i) => {
                                    return (<li key={subPlan.title + i} className="blue-grey darken-4 blue-grey-text text-lighten-5">
                                                <a href={"#subPlan"+i} className="sub-plan-link collapsible-header blue-grey darken-4 blue-grey-text text-lighten-4">
                                                    {subPlan.title}
                                                    <i className="material-icons right blue-grey darken-4 blue-grey-text text-darken-3"
                                                        onClick={()=>deleteSubPlan(subPlan.title)}>delete_forever</i>
                                                </a>
                                            </li>)
                                })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SelectedPlanMenu;

/*
<button className="btn waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5"
        onClick={()=>{props.changeView('search')}}>
    <i className="material-icons left">add</i>
    Create-A-Project
</button>
 */
