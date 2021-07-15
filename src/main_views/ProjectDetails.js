import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import PlanDetailsMenu from './notebook/PlanDetailsMenu.js';
import ProjectLevel from './notebook/ProjectLevel.js';
import ProjectStepsSection from './notebook/ProjectStepsSection.js';

function ProjectDetails (props) {
    const addModal = useRef(null);
    const [addModalTitle, setAddModalTitle] = useState("");
    const [addModalType, setAddModalType] = useState("");
    const [addModalValue, setAddModalValue] = useState("");
    const [addModalSelectValue, setAddModalSelectValue] = useState("");
    const [addModalCheckTypeValue, setAddModalCheckTypeValue] = useState("");
    //const [selectedLevel, setSelectedLevel] = useState("");
    const scrollspyElems = useRef(null);
    const addModalSelect = useRef(null);
    const addModalChecksSelect = useRef(null);

    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true
        }
        M.Modal.init(addModal.current, addModalOptions);
        M.FormSelect.init(addModalChecksSelect.current);
        M.FormSelect.init(addModalSelect.current);
    }, [])

    useEffect(() => {
        scrollspyElems.current = document.querySelectorAll('.scrollspy')
        console.log(scrollspyElems)
        M.ScrollSpy.init(scrollspyElems.current);
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
            case "add-modal-select":
                setAddModalSelectValue(event.target.value);
                break;
            case "add-modal-checks-select":
                setAddModalCheckTypeValue(event.target.value)
                break;
            default:
                return;
        }
    }

    function addNewSection (parentId) {
        const planId = props.userPlans[props.selectedPlanIndex].id;
        console.log(addModalValue);
        const newArr = [];
        let updatedFieldObj;
        if (addModalValue.trim().length > 0){
            switch (addModalType) {
                case "substep":
                    newArr.concat(props.userPlans[props.selectedPlanIndex].sub_plans)
                    newArr.push({title:addModalValue, parent:parentId})
                    console.log(newArr);
                    updatedFieldObj = {sub_plans:newArr}
                    break;
                case "checklist":
                    newArr.concat(props.userPlans[props.selectedPlanIndex].sub_plans)
                    newArr.push({title:addModalValue, parent:parentId})
                    updatedFieldObj = {checks:newArr};
                    break;
                default:
            }
        props.savePlanChanges(planId, updatedFieldObj)
        }
    }
    function openAddModal(e){
        console.log(e.target.id);

        let activeSectionId;
        M.ScrollSpy.init(scrollspyElems.current, {
            getActiveElement: function (id) {
                activeSectionId = id;
            }
        });
        console.log(activeSectionId);
        setAddModalSelectValue(activeSectionId);

        const addModalInstance = M.Modal.getInstance(addModal.current)
        switch (e.target.id) {
            case "add-substep-btn":
                setAddModalTitle("Add New Substep");
                setAddModalType("substep");
                break;
            case "add-checklist-btn":
                setAddModalTitle("Add New Checklist");
                setAddModalType("checklist");
                break;
            default:
                return;
        }

        addModalInstance.open();
    }

    const substepSections = props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan,i) => {
        return(
            <div key={subPlan.title + i} id={subPlan.id} className="row scrollspy">
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
            <div className="nav-wrapper row blue-grey darken-4 blue-grey-text text-lighten-5">
                <div className="col s12">
                    <button type="button" className="waves-effect waves-blue btn-flat blue-grey darken-4 blue-grey-text text-lighten-5 " onClick={()=>{props.handleMainAppView('HomePage')}}><i className="material-icons left">arrow_back</i></button>
                    <h5 id={props.userPlans[props.selectedPlanIndex].id} className="scrollspy blue-grey darken-4 blue-grey-text text-lighten-5 header">
                        {props.userPlans[props.selectedPlanIndex].title}
                    </h5>
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
                <div className="col s8 offset-s1">
                    <div className="row">
                        <ProjectLevel
                            userPlans={props.userPlans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            changeOrUpdatePlanDraft={props.changeOrUpdatePlanDraft}
                            savePlanChanges={props.savePlanChanges}/>
                    </div>
                    <div className="row">
                        {substepSections}
                    </div>
                </div>
                <PlanDetailsMenu
                    userPlans={props.userPlans}
                    selectedPlanIndex={props.selectedPlanIndex}
                    updateSelectedPlan={props.updateSelectedPlan}
                    addUserPlan={props.addUserPlan}
                    removeUserPlan={props.removeUserPlan}
                    savePlanChanges={props.savePlanChanges}
                    updateSearchResults={props.updateSearchResults}
                    handleMainAppView={props.handleMainAppView}
                    openAddModal={openAddModal}
                />
            </div>
            <div ref={addModal} id={"add-modal"+props.userPlans[props.selectedPlanIndex].title} className="modal">
                <div className="modal-content">
                    <h4>{addModalTitle}</h4>
                    {
                        addModalType === "substep" &&
                        <div className="input-field">
                            <input type="text" placeholder="Title"
                                    id={"new_"+addModalType}
                                    className="validate"
                                    value={addModalValue}
                                    onChange={(e) => handleChange(e)}/>
                        </div>
                    }
                    <div className="row">
                        {
                            addModalType === "checklist" &&
                            <div className="input-field col s6">
                                <select ref={addModalChecksSelect} id="add-modal-checks-select" value={addModalCheckTypeValue} onChange={handleChange}>
                                    <option value="">Select One</option>
                                    <option value="tools">Tools</option>
                                    <option value="materials">Materials</option>
                                </select>
                                <label>Checklist Type</label>
                            </div>
                        }
                        <div className="input-field col s6">
                            <select id="add-modal-select" ref={addModalSelect} value={addModalSelectValue} onChange={handleChange}>
                                <option value={props.userPlans[props.selectedPlanIndex].id}>Plan Overview</option>
                                {
                                    props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan, i) => {
                                        return <option key={subPlan.title + i} value={subPlan.id}>{subPlan.title}</option>
                                    })
                                }
                            </select>
                            <label>Add to...</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <a id="addModal-add-btn"
                        href="#projectDetails"
                        className="modal-close waves-effect waves-blue btn-flat"
                        onClick={() => addNewSection(addModalSelectValue)}>
                        Add
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails;
