import React from 'react';
import ProjectLevel from './ProjectLevel.js';
import ProjectStepsSection from './ProjectStepsSection.js';

function ProjectDetails (props) {

    function updateSubPlan (index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            props.userPlans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {sub_plans: updatedSubPlans})
    }

    const substepSections = props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan,i) => {
        return(
            <div key={subPlan.title + i} className="row">
                <div className="nav-wrapper">
                    <div className="row blue lighten-3">
                        <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
                            <h6 className="center-align">{subPlan.title}</h6>
                        </div>
                    </div>
                </div>
                <ProjectStepsSection
                    subPlan={subPlan}
                    subPlanIndex = {i}
                    updateSubPlan = {updateSubPlan}
                    planId = {props.userPlans[props.selectedPlanIndex].id}
                    savePlanChanges={props.savePlanChanges}
                    />
            </div>
        )
    })
    return (
        <div className="col s12 blue-grey darken-4 blue-grey-text text-lighten-5">
            <div className="nav-wrapper">
                <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                    <div className="col s12">
                        <h5 className="blue-grey darken-4 blue-grey-text text-lighten-5 header">{props.userPlans[props.selectedPlanIndex].title}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <button className="btn waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button" name="action"
                            onClick={()=> props.handleMainAppView('SearchResults')}><i className="material-icons left tiny">search</i>
                            Constructapedia
                    </button>
                </div>
            </div>
            <ProjectLevel
                userPlans={props.userPlans}
                selectedPlanIndex={props.selectedPlanIndex}
                changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                savePlanChanges={props.savePlanChanges}/>
            <div className="row">
                <div className="col s12">
                    {substepSections}
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails;
/*
<div className="divider"></div>
<ProjectStepsSection planDraft={props.planDraft} changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}/>

const [titleValue, setTitleValue] = useState("");
projectToChange.title = titleValue;
<div className="row">
    <div className="input-field col s12">
        <input id="title_input" type="text" className="validate" value={titleValue} onChange={handleChange} placeholder=""/>
        <label className="active" htmlFor="title_input">Project Title</label>
    </div>
</div>
<div className="divider"></div>

<div className="row">
    <div className="input-field col s12">
        <textarea id="goal_textarea"
            className="materialize-textarea"
            value={goalValue}
            onChange={handleChange}/>
        <label htmlFor="notes_textarea">Project Goal</label>
    </div>
</div>

<div className="col s11">
    <ul ref={addMenuDropdown} className="collapsible">
        <li>
            <div className="collapsible-header">Substep<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body">
                <span>Lorem ipsum dolor sit amet.</span>
                <button className="btn-floating waves-effect waves-light blue" type="button" name="action"
                        onClick={addSubstep}><i className="material-icons">add</i></button>
            </div>
        </li>
        <li>
            <div className="collapsible-header">Tools List<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span>
                <i className="material-icons">add_circle</i>
            </div>
        </li>
        <li>
            <div className="collapsible-header">Materials List<i className="material-icons">arrow_drop_down</i></div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
    </ul>
</div>

*/
