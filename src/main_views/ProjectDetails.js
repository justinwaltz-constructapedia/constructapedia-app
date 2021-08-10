//Import React and hooks used
import React, { useState, useEffect, useRef } from 'react';
//Import Materialize functionality
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import PlanDetailsMenu from './notebook/PlanDetailsMenu.js';
import ProjectLevel from './notebook/ProjectLevel.js';
//Functional Component
//Handles viewing and editing of project details
//"Source of truth" for add modal values of the selected plan
function ProjectDetails(props) {
    //State Hooks
    const [addModalTitle, setAddModalTitle] = useState('');
    const [addModalType, setAddModalType] = useState('');
    const [addModalValue, setAddModalValue] = useState('');
    const [addModalSelectValue, setAddModalSelectValue] = useState('');
    const [addModalCheckTypeValue, setAddModalCheckTypeValue] =
        useState('tools');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [reload, setReload] = useState(false);

    //Ref Hooks
    //Materialize functionality
    //Add Modal
    const addModal = useRef(null);
    //Material <select> fields
    const addModalSelect = useRef(null);
    const addModalChecksSelect = useRef(null);

    //Effect Hooks
    //Intitialzes Materialize form select
    //Runs on every render
    useEffect(() => {
        M.FormSelect.init(addModalSelect.current);
        M.FormSelect.init(addModalChecksSelect.current);
    });
    //Intitialzes Materialize modal
    //Runs on initial render only
    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true,
        };
        M.Modal.init(addModal.current, addModalOptions);
    }, []);
    //Resets reload to false on a re-render do to a change in the selected plan
    //Avoids conflict between the DOM and Virtual DOM with the Materialize Tabs
    useEffect(() => {
        setSelectedLevel(props.userPlans[props.selectedPlanIndex].id);
        // if (props.userPlans[props.selectedPlanIndex].sub_plans.length === 0) {
        //     setReload(true);
        // } else {
        setReload(false);
        // }
    }, [props.userPlans, props.selectedPlanIndex]);

    //Component Functionality
    //Sets state values for various inputs on add modal
    function handleChange(event) {
        const eventId = event.target.id;
        switch (eventId) {
            case 'add-modal-title-input':
                setAddModalValue(event.target.value);
                break;
            case 'add-modal-select':
                setAddModalSelectValue(event.target.value);
                break;
            case 'add-modal-checks-select':
                setAddModalCheckTypeValue(event.target.value);
                break;
            default:
                return;
        }
    }
    //Delete function for fields directly under a plan object: sub_plans, notes, checks
    function deleteItemInPlan(itemFieldName, itemIndex) {
        const currentPlan = props.userPlans[props.selectedPlanIndex];
        const newItemFieldList = currentPlan[itemFieldName].reduce(
            (itemFieldList, item, i) => {
                if (itemIndex !== i) {
                    itemFieldList.push(item);
                }
                return itemFieldList;
            },
            []
        );
        const updateObj = {};
        updateObj[itemFieldName] = newItemFieldList;
        console.log(updateObj);
        props.savePlanChanges(currentPlan.id, updateObj);
        setReload(true);
    }
    //Processes and updates the plan field corresponding to the submission on the add modal
    function addNewSection() {
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const parentId = addModalSelectValue;
        const currentChecks = props.userPlans[props.selectedPlanIndex].checks;
        const newArr = [];
        let updatedFieldObj;
        //Needs to account for being under different levels
        if (addModalValue.trim().length > 0) {
            switch (addModalType) {
                case 'substep':
                    const prevSubplans = newArr.concat(
                        props.userPlans[props.selectedPlanIndex].sub_plans
                    );
                    prevSubplans.push({
                        title: addModalValue,
                        parent: parentId,
                    });
                    updatedFieldObj = { sub_plans: prevSubplans };
                    break;
                case 'checklist':
                    console.log(currentChecks);
                    console.log(newArr);
                    const newChecks = newArr.concat(currentChecks);
                    newChecks.push({
                        title: addModalValue,
                        parent: parentId,
                        list_type: addModalCheckTypeValue,
                    });
                    console.log(newChecks);
                    updatedFieldObj = { checks: newChecks };
                    break;
                default:
            }
            console.log(planId, updatedFieldObj);
            props.savePlanChanges(planId, updatedFieldObj);
        }
    }
    //Sets the state and info to render the add modal for the desired section
    function openAddModal(e) {
        console.log(e.target.id);
        setAddModalSelectValue(selectedLevel);
        const addModalInstance = M.Modal.getInstance(addModal.current);
        console.log(addModalInstance);
        switch (e.target.id) {
            case 'add-substep-btn':
                setAddModalTitle('Add New Substep');
                setAddModalType('substep');
                break;
            case 'add-checklist-btn':
                setAddModalTitle('Add New Checklist');
                setAddModalType('checklist');
                break;
            default:
                return;
        }
        addModalInstance.open();
    }
    //Return view of this component:
    //Includes the ProjectLevel, opening the modal to add plan sections
    return (
        <div>
            <div className='col s12'>
                <div className='row'>
                    <div className='col s12'>
                        <button
                            type='button'
                            className='waves-effect waves-blue btn-flat '
                            onClick={() => {
                                props.handleMainAppView('HomePage');
                            }}
                        >
                            <i className='material-icons left indigo-text'>
                                arrow_back
                            </i>
                        </button>
                        <button
                            className='btn waves-effect waves-light indigo'
                            type='button'
                            name='action'
                            onClick={() =>
                                props.handleMainAppView('SearchResults')
                            }
                        >
                            <i className='material-icons left tiny'>search</i>
                            Constructapedia
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col s12'>
                        <div>
                            <ProjectLevel
                                userPlans={props.userPlans}
                                selectedPlanIndex={props.selectedPlanIndex}
                                savePlanChanges={props.savePlanChanges}
                                deleteItemInPlan={deleteItemInPlan}
                                reload={reload}
                            />
                        </div>
                    </div>
                    <PlanDetailsMenu
                        userPlans={props.userPlans}
                        selectedPlanIndex={props.selectedPlanIndex}
                        updateSelectedPlan={props.updateSelectedPlan}
                        addUserPlan={props.addUserPlan}
                        removeUserPlan={props.removeUserPlan}
                        savePlanChanges={props.savePlanChanges}
                        handleMainAppView={props.handleMainAppView}
                        openAddModal={openAddModal}
                    />
                </div>
                <div
                    ref={addModal}
                    id={
                        'add-modal' +
                        props.userPlans[props.selectedPlanIndex].title
                    }
                    className='modal'
                >
                    <div className='modal-content'>
                        <h4>{addModalTitle}</h4>
                        <div className='input-field'>
                            np
                            <input
                                type='text'
                                placeholder='Title'
                                id={'add-modal-title-input'}
                                className='validate'
                                value={addModalValue}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className='row'>
                            {addModalType === 'checklist' && (
                                <div className='input-field col s6'>
                                    <select
                                        id='add-modal-checks-select'
                                        ref={addModalChecksSelect}
                                        value={addModalCheckTypeValue}
                                        onChange={handleChange}
                                    >
                                        <option value='tools'>Tools</option>
                                        <option value='materials'>
                                            Materials
                                        </option>
                                    </select>
                                    <label>Checklist Type</label>
                                </div>
                            )}
                            <div className='input-field col s6'>
                                <select
                                    id='add-modal-select'
                                    ref={addModalSelect}
                                    value={addModalSelectValue}
                                    onChange={handleChange}
                                >
                                    <option
                                        value={
                                            props.userPlans[
                                                props.selectedPlanIndex
                                            ].id
                                        }
                                    >
                                        Plan Overview
                                    </option>
                                    {props.userPlans[
                                        props.selectedPlanIndex
                                    ].sub_plans.map((subPlan, i) => {
                                        return (
                                            <option
                                                key={subPlan.title + i}
                                                value={subPlan.id}
                                            >
                                                {subPlan.title}
                                            </option>
                                        );
                                    })}
                                </select>
                                <label>Add to...</label>
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <a
                            id='addModal-add-btn'
                            href='#projectDetails'
                            className='modal-close waves-effect waves-blue btn-flat'
                            onClick={addNewSection}
                        >
                            Add
                        </a>
                    </div>
                </div>
            </div>
            {/*<div className='fixed-action-btn toolbar'>
            <a className='btn-floating btn-small'>
              <i className='material-icons'>mode_edit</i>
            </a>
            <ul>
              <li className='waves-effect waves-light'>
                <a href='#!'>
                  <i className='material-icons'>mode_edit</i>
                </a>
              </li>
              <li className='waves-effect waves-light'>
                <a href='#!'>
                  <i className='material-icons'>mode_edit</i>
                </a>
              </li>
              <li className='waves-effect waves-light'>
                <a href='#!'>
                  <i className='material-icons'>mode_edit</i>
                </a>
              </li>
            </ul>
                    </div>*/}
        </div>
    );
}

export default ProjectDetails;

/*
console.log(scrollspyElems.current);
let activeSectionId;
M.ScrollSpy.init(scrollspyElems.current, {
    getActiveElement: function (id) {
        activeSectionId = id;
    }
});
*/
/*const substepSections = props.userPlans[
props.selectedPlanIndex
].sub_plans.map((subPlan, i) => {
return (
  <div key={subPlan.title + i} id={subPlan.id} className='row'>
    <div className='nav-wrapper'>
      <div className='row blue lighten-3'>
        <div className='col s12'>
          <h6 className='center-align'>{subPlan.title}</h6>
        </div>
      </div>
    </div>
    <ProjectStepsSection
      subPlan={subPlan}
      subPlanIndex={i}
      updateSubPlan={updateSubPlan}
      planId={props.userPlans[props.selectedPlanIndex].id}
      savePlanChanges={props.savePlanChanges}
    />
  </div>
);
});*/
/*<li
    id={props.userPlans[props.selectedPlanIndex].id}
    className='collection-header indigo-text'
>
    <b>{props.userPlans[props.selectedPlanIndex].title}</b>
</li>*/
/*
    <li className='collection-item'>{substepSections}</li>
*/

/*
    function updateSubPlan(index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            props.userPlans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {
            sub_plans: updatedSubPlans,
        });
    }
*/
