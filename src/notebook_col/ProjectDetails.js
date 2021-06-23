import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import ProjectLevel from './ProjectLevel.js';
import ProjectStepsSection from './ProjectStepsSection.js';

function ProjectDetails (props) {
    const addMenuDropdown = useRef(null);
    const addModal = useRef(null);
    const [addModalTitle, setAddModalTitle] = useState("");
    const [addModalType, setAddModalType] = useState("");
    const[addModalValue, setAddModalValue] = useState("");

    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true
        }
        M.Collapsible.init(addMenuDropdown.current);
        M.Modal.init(addModal.current, addModalOptions);
    }, [])

    function updateSubPlan (index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            props.userPlans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {sub_plans: updatedSubPlans})
    }
    function handleChange(event) {
        const eventId = event.target.id
        switch (eventId) {
            case "new_substep":
                setAddModalValue(event.target.value);
                break;
            default:
                return;
        }
    }
    function addNewSection (itemBtnID) {
        console.log(itemBtnID);
        const planId = props.userPlans[props.selectedPlanIndex].id;
        if (addModalType === "substep" && addModalValue.trim().length > 0){
            console.log(addModalValue);
            const updatedPlanSubsteps = [].concat(props.userPlans[props.selectedPlanIndex].sub_plans)
            updatedPlanSubsteps.push({title:addModalValue})
            console.log(updatedPlanSubsteps);
            props.savePlanChanges(planId, {sub_plans:updatedPlanSubsteps})
        }
    }
    function openAddModal(e){
        console.log(e.target.id)
        const addModalInstance = M.Modal.getInstance(addModal.current)
        if (e.target.id === "add-substep-btn"){
            setAddModalTitle("Add New Substep");
            setAddModalType("substep");
            addModalInstance.open();
        }
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
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <ProjectLevel
                    userPlans={props.userPlans}
                    selectedPlanIndex={props.selectedPlanIndex}
                    changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                    savePlanChanges={props.savePlanChanges}/>
                <div className="col s2 center-align">
                    <h5 className="center-align"><b>&#123;C&#125;</b></h5>

                    <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                        <a id="add-substep-btn" href="#add-modal"
                            className="waves-effect waves-blue btn valign-wrapper blue-grey darken-3 blue-grey-text text-lighten-5"
                            onClick={(e)=> openAddModal(e)}>
                            Work Step<i className="material-icons left">add</i>
                        </a>
                    </div>
                </div>
            </div>
            <div ref={addModal} id={"add-modal"+props.userPlans[props.selectedPlanIndex].title} className="modal">
                <div className="modal-content">
                    <h4>{addModalTitle}</h4>
                    <div className="input-field">
                        <input type="text" placeholder="Title"
                                id={"new_"+addModalType}
                                className="validate"
                                value={addModalValue}
                                onChange={(e) => handleChange(e)}/>
                    </div>
                </div>
                <div className="modal-footer">
                    <a id="addModal-add-btn" href="#projectDetails"
                        className="modal-close waves-effect waves-blue btn-flat"
                        onClick={(e) => addNewSection(e.target.id)}>
                        Add
                    </a>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    {substepSections}
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails;
