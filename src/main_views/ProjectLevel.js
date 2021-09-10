//Import React and hooks used
import React, { useEffect, useRef, useReducer, useContext } from 'react';
//Import Materialize functionality
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
//Import for useContext
import {PlanContext} from '../PlanContext.js'
//Import Project Components
import SimpleCheckboxSection from './notebook/SimpleCheckboxSection.js';
import NotesSection from './notebook/NotesSection.js';
import ProjectStepsSection from './notebook/ProjectStepsSection.js';
import Bookmarks from './notebook/Bookmarks.js';
import UrlLinks from './notebook/UrlLinks.js';
import AddModal from '../modals/AddModal.js';
import PlanDetailsMenu from './notebook/PlanDetailsMenu.js';
//Import Styles
import './ProjectLevel.css';
//Import api functions for updating database
// import {putPlanUpdate} from '../api/projectsApi';

function reducer (state, action) {
    switch (action.type) {
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        default:
            return state;
    }
}

function ProjectLevel(props) {
    //useContext hook
    const [contextState, savePlanChanges, addUserPlan, removeUserPlan] = useContext(PlanContext);
    //Reducer Hook
    const initialState = {
        newBookmarkValue: '',
        newBookmarkTitleValue: '',
        addModalHeader: '',
        addModalType: '',
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    //Ref Hooks for Materialize functionality
        //Ref hook for the substep tabs directly under the project
    const substepTabsUl = useRef(null);
    const collapsibleProject = useRef(null);
    const addModal = useRef(null);
    /**
     * Effect hooks
     *
     */
        //Initialze Materialize collapsible for main plan level
    useEffect(() => {
        const collapsibleOptions = { accordion: false };
        M.Collapsible.init(collapsibleProject.current, collapsibleOptions);
    },[contextState.plans]);
        //Hook for intializing the substep tab functionality using Materialize
    useEffect(() => {
        // const tabsOptions = {
        //     swipeable: true,
        // };
        // , tabsOptions
        M.Tabs.init(substepTabsUl.current);
    }, []);
        //Intitialzes Materialize modal; Runs on initial render only
    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true,
        };
        M.Modal.init(addModal.current, addModalOptions);
    }, []);
    //Sets the state and info to render the add modal for the desired section
    function openAddModal(e) {
        console.log(e.currentTarget);
        const addModalInstance = M.Modal.getInstance(addModal.current);
        console.log(addModalInstance);
        switch (e.currentTarget.id) {
            case 'add-substep-btn':
                dispatch({type:'field',field:'addModalHeader',payload:'Add New WorkStep'});
                dispatch({type:'field',field:'addModalType',payload:'substep'});
                break;
            case 'add-checklist-btn':
                dispatch({type:'field',field:'addModalHeader',payload:'Add New Checklist'});
                dispatch({type:'field',field:'addModalType',payload:'checklist'});
                break;
            default:
                return;
        }
        addModalInstance.open();
    }

    //Processes and updates the plan field corresponding to the submission on the add modal
    async function addNewSection(addModalValue, addModalSelectValue, addModalCheckTypeValue) {
        console.log(addModalValue, addModalSelectValue, addModalCheckTypeValue);
        const planId = props.userPlans[props.selectedPlanIndex].id;
        const parentId = addModalSelectValue;
        const newArr = [];
        let updatedFieldObj;
        let itemFieldName;
        //dispatch({type: 'saving'})
        //Needs to account for being under different levels
        if (addModalValue.trim().length > 0) {
            switch (state.addModalType) {
                case 'substep':
                    const prevSubplans = newArr.concat(
                        props.userPlans[props.selectedPlanIndex].sub_plans
                    );
                    prevSubplans.push({
                        title: addModalValue,
                        parent: parentId,
                        notes: []
                    });
                    updatedFieldObj = { sub_plans: prevSubplans };
                    itemFieldName = 'sub_plans';
                    break;
                case 'checklist':
                    const currentChecks = props.userPlans[props.selectedPlanIndex].checks;
                    console.log(currentChecks);
                    const newChecks = newArr.concat(currentChecks);
                    newChecks.push({
                        title: addModalValue,
                        parent: parentId,
                        list_type: addModalCheckTypeValue,
                    });
                    console.log(newChecks);
                    updatedFieldObj = { checks: newChecks };
                    itemFieldName = 'checks';
                    break;
                default:
            }
            console.log(planId, updatedFieldObj);
            try {
                savePlanChanges(planId, updatedFieldObj);
            } catch (error) {
                dispatch({type: 'error', payload: error})
            }
            savePlanChanges(planId, updatedFieldObj);
        }
    }
    function updateChecklist(checklistIndex, action, itemArr, itemIndex) {
        //NOTE: Change this to a reduce function in the switch?
        const currentChecks = [].concat(
            contextState.plans[props.selectedPlanIndex].checks
        );
        console.log(checklistIndex, action, itemArr, itemIndex);
        console.log(currentChecks);
        switch (action) {
            case 'addItem':
                const newChecks = currentChecks.reduce(
                    (checks, check, index) => {
                        if (checklistIndex === index) {
                            const newCheckList =
                                currentChecks[checklistIndex].list.concat(
                                    itemArr
                                );
                            check.list = newCheckList;
                        }
                        checks.push(check);
                        return checks;
                    },
                    []
                );
                console.log(newChecks);
                savePlanChanges(
                    contextState.plans[props.selectedPlanIndex].id,
                    {
                        checks: newChecks,
                    }
                );
                break;
            case 'updateItem':
                currentChecks[checklistIndex].list = itemArr;
                savePlanChanges(
                    contextState.plans[props.selectedPlanIndex].id,
                    {
                        checks: currentChecks,
                    }
                );
                break;
            default:
        }
    }

    function updateNotes(isNewNote, newNoteObj) {
        let updatedNotes;
        if (isNewNote) {
            updatedNotes = [].concat(
                contextState.plans[props.selectedPlanIndex].notes
            );
            updatedNotes.push(newNoteObj);
        } else {
            updatedNotes = newNoteObj;
        }
        savePlanChanges(contextState.plans[props.selectedPlanIndex].id, {
            notes: updatedNotes,
        });
    }

    function updateSubPlan(index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            contextState.plans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        savePlanChanges(contextState.plans[props.selectedPlanIndex].id, {
            sub_plans: updatedSubPlans,
        });
    }
    //Delete function for fields directly under a plan object: sub_plans, notes, checks
    async function deleteItemInPlan(itemFieldName, itemIndex) {
        const currentPlan = contextState.plans[props.selectedPlanIndex];
        const currentPlanList = [].concat(currentPlan[itemFieldName])
        const newItemFieldList = currentPlanList.reduce(
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
        dispatch({type: 'saving'})
        try {
            await savePlanChanges(currentPlanList.id, updateObj)

        } catch (error) {
            console.log(error);
        }
        //props.savePlanChanges(currentPlan.id, updateObj);
    }

    const addBookmark = (url, title) => {
        const newBookmark = {
            url: state.newBookmarkValue,
            title: state.newBookmarkTitleValue,
        };
        let updatedBookmarksObj;
        if (contextState.plans[props.selectedPlanIndex].bookmarks) {
            const updatedBookmarksList = [newBookmark].concat(
                contextState.plans[props.selectedPlanIndex].bookmarks
            );
            updatedBookmarksObj = { bookmarks: updatedBookmarksList };
        } else {
            updatedBookmarksObj = { bookmarks: [newBookmark] };
        }
        console.log(
            contextState.plans[props.selectedPlanIndex].id,
            updatedBookmarksObj
        );
        props.savePlanChanges(
            contextState.plans[props.selectedPlanIndex].id,
            updatedBookmarksObj
        );
        // setNewBookmarkValue('');
        // setNewBookmarkTitleValue('');
    };

    const checksSections = contextState.plans[props.selectedPlanIndex].checks.map(
        (checkObj, i) => {
            return (
                <div key={checkObj.title + i} className='col s12 m6'>
                    <SimpleCheckboxSection
                        checklist={checkObj.list}
                        listType={checkObj.list_type}
                        listTitle={checkObj.title}
                        checklistIndex={i}
                        import_url={checkObj.import_url}
                        updateChecklist={updateChecklist}
                        deleteItemInPlan={deleteItemInPlan}
                    />
                </div>
            );
        }
    );
    function makeListOfSubPlanTabElements (arr) {
        return arr.map((subPlan, i) => {
            if (contextState.plans[props.selectedPlanIndex]) {
                return (
                    <li key={subPlan.id} className='tab col s3'>
                        <a href={'#' + subPlan.id}>{subPlan.title}</a>
                    </li>
                )
            } else {
                return null;
            }
        });
    }
    const substepTabs = (contextState.plans[props.selectedPlanIndex]) ? makeListOfSubPlanTabElements(contextState.plans[props.selectedPlanIndex].sub_plans) : <li className='tab col s3'><a href='#no-sub-plans'>Add step</a></li>

    function makeListOfSubPlanDisplayElements (arr) {
        return arr.map((subPlan, i) => {
            if (contextState.plans[props.selectedPlanIndex]) {
                return (
                    <div key={subPlan.title + i} id={subPlan.id}>
                        <div className='row'>
                            <div className='col s12'>
                                <div className='card indigo white-text'>
                                    <div className='nav-wrapper '>
                                        <div className='row'>
                                            <div className='col s12'>
                                                <h6 className='center-align'>
                                                    {subPlan.title}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <ProjectStepsSection
                                        subPlan={subPlan}
                                        subPlanIndex={i}
                                        updateSubPlan={updateSubPlan}
                                        savePlanChanges={props.savePlanChanges}
                                        deleteItemInPlan={deleteItemInPlan}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return <div key='no-sub-plans' id='no-sub-plans'></div>;
            }
        });
    }
    const substepSections = makeListOfSubPlanDisplayElements(contextState.plans[props.selectedPlanIndex].sub_plans);

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
                            <div className='col s12'>
                                <div className='row'>
                                    <ul
                                        ref={collapsibleProject}
                                        className='collapsible expandable z-depth-0'
                                    >
                                        <li
                                            id={contextState.plans[props.selectedPlanIndex].id}
                                            className='collection-header indigo-text center'
                                        >
                                            <h6>
                                                <b>
                                                    {contextState.plans[props.selectedPlanIndex].title}
                                                </b>{' '}
                                                <i className='tiny material-icons red-text text-accent-4'>
                                                    edit
                                                </i>
                                            </h6>
                                        </li>
                                        <li>
                                            <div className='collapsible-header indigo-text'>
                                                <i className='material-icons center indigo-text'>
                                                    edit
                                                </i>
                                            </div>
                                            <div className='collapsible-body indigo-text'>
                                                <NotesSection
                                                    updateNotes={updateNotes}
                                                    notes={
                                                        contextState.plans[props.selectedPlanIndex]
                                                            .notes
                                                    }
                                                    deleteItemInPlan={deleteItemInPlan}
                                                />
                                            </div>
                                        </li>
                                        <div className='active'>
                                            <UrlLinks
                                                planId={contextState.plans[props.selectedPlanIndex].id}
                                                savePlanChanges={savePlanChanges}
                                                videoUrls={
                                                    contextState.plans[props.selectedPlanIndex]
                                                        .video_urls
                                                }
                                            />
                                        </div>
                                        <li className='active'>
                                            <div className='collapsible-header indigo-text'>
                                                <i className='material-icons center indigo-text'>
                                                    bookmark
                                                </i>
                                                <b>Bookmarked Sites</b>
                                            </div>
                                            <div className='collapsible-body'>
                                                <Bookmarks
                                                    bookmarks = {contextState.plans[props.selectedPlanIndex].bookmarks}
                                                    addBookmark = {addBookmark}
                                                />
                                            </div>
                                        </li>
                                        <li className='active'>
                                            <div className='collapsible-header indigo-text'>
                                                <i className='material-icons center indigo-text'>
                                                    offline_pin
                                                </i>
                                                <b>Checklists</b> (Planning)
                                            </div>
                                            <div className='collapsible-body'>
                                                <section>
                                                    <div className='row'>
                                                        {contextState.plans[props.selectedPlanIndex]
                                                            .checks.length > 0 && checksSections}
                                                    </div>
                                                </section>
                                            </div>
                                        </li>
                                        <li className='active'>
                                            <div className='collapsible-header indigo-text'>
                                                <i className='material-icons center indigo-text'>
                                                    traffic
                                                </i>
                                                <b>Worksteps</b> (Execution)
                                            </div>
                                            <div className='collapsible-body'>
                                                <section>
                                                <ul
                                                    ref={substepTabsUl}
                                                    className='tabs'
                                                >
                                                    {substepTabs}
                                                </ul>
                                                {substepSections}
                                                </section>
                                            </div>
                                        </li>
                                        <li className='active'>
                                            <div className='collapsible-header red-text text-accent-4'>
                                                <i className='material-icons center'>
                                                    pregnant_woman
                                                </i>
                                                <b>Project Details</b>
                                            </div>
                                            <div className='collapsible-body'>
                                                <div>
                                                    <section className='section section-details'>
                                                        <div className='row'>
                                                            <div className='col s12'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        description
                                                                    </i>
                                                                    <p>Project Description</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        photo_library
                                                                    </i>
                                                                    <p>Project Pictures</p>
                                                                    <div className='row'>
                                                                        <div className='col s12 m4'>
                                                                            <div className='card'>
                                                                                Existing Conditions
                                                                                and Planning
                                                                            </div>
                                                                        </div>
                                                                        <div className='col s12 m4'>
                                                                            <div className='card'>
                                                                                Progress Photos
                                                                            </div>
                                                                        </div>
                                                                        <div className='col s12 m4'>
                                                                            <div className='card'>
                                                                                Finished Photos
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </li>
                                        <li className=''>
                                            <div className='collapsible-header red-text text-accent-4'>
                                                <i className='material-icons'>child_friendly</i>
                                                <b> Finished Project Requierements</b>
                                            </div>
                                            <div className='collapsible-body'>
                                                <div>
                                                    <section className='section section-details'>
                                                        <div className='row'>
                                                            <div className='col s12 m3'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        description
                                                                    </i>
                                                                    <p>Project Description</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12 m3'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        photo_library
                                                                    </i>
                                                                    <p>Project Pictures</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12 m3'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        playlist_add_check
                                                                    </i>
                                                                    <p>Check List</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12 m3'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        format_list_numbered
                                                                    </i>
                                                                    <p>Work Steps</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </li>
                                        <li className=''>
                                            <div className='collapsible-header red-text text-accent-4'>
                                                <i className='material-icons'>device_hub</i>
                                                <b> Construct-A-Network</b>
                                            </div>
                                            <div className='collapsible-body'>
                                                <div>
                                                    <section className='section section-details'>
                                                        <div className='row'>
                                                            <div className='col s12 m4'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        screen_share
                                                                    </i>
                                                                    <p>Share</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12 m4'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        contact_phone
                                                                    </i>
                                                                    <p>Request Help</p>
                                                                </div>
                                                            </div>
                                                            <div className='col s12 m4'>
                                                                <div className='card-panel center red-text text-accent-4'>
                                                                    <i className='material-icons'>
                                                                        feedback
                                                                    </i>
                                                                    <p>Comments</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </div>
                        <PlanDetailsMenu
                            userPlans={contextState.plans}
                            selectedPlanIndex={props.selectedPlanIndex}
                            updateSelectedPlan={props.updateSelectedPlan}
                            addUserPlan={addUserPlan}
                            removeUserPlan={removeUserPlan}
                            savePlanChanges={savePlanChanges}
                            handleMainAppView={props.handleMainAppView}
                            openAddModal={openAddModal}
                        />
                    </div>
                    <div
                        ref={addModal}
                        id={
                            'add-modal' +
                            contextState.plans[props.selectedPlanIndex].title
                        }
                        className='modal'
                    >
                        <AddModal
                            addModalHeader={state.addModalHeader}
                            addModalType={state.addModalType}
                            parentValue={contextState.plans[props.selectedPlanIndex].id}
                            subPlans={contextState.plans[props.selectedPlanIndex].sub_plans}
                            addNewSection={addNewSection}
                        />
                    </div>
                </div>
            </div>
    );
}

export default ProjectLevel;
