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
import Bookmarks from './notebook/Bookmarks.js';
import UrlLinks from './notebook/UrlLinks.js';
import ProjectPictures from './notebook/ProjectPictures.js';
import AddModal from '../modals/AddModal.js';
import PlanDetailsMenu from './notebook/PlanDetailsMenu.js';
//Import Styles
import './ProjectLevel.css';
//Import api functions for updating database
import {postPlan, getUserPlans} from '../api/projectsApi';

function reducer (state, action) {
    switch (action.type) {
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        case 'breadcrumb':
            const newBreadcrumbArr = [...state.sowBreadcrumbsArr];
            switch (action.field) {
                case 'back':
                    newBreadcrumbArr.pop()
                    break;
                case 'add':
                    newBreadcrumbArr.push(action.payload)
                    break;
                default:
                    break;
            }
            return {
                ...state,
                sowBreadcrumbsArr: newBreadcrumbArr
            }
        default:
            return state;
    }
}

function ProjectLevel({ handleMainAppView, savePlanChanges, getSowObj, mainDriveFolderId, createDriveFolder}) {
    //useContext hook
    const [contextState, contextDispatch] = useContext(PlanContext);
    const {plans, selectedPlanIndex, selectedSowId} = contextState;
    //Reducer Hook

    const initialState = {
        addModalHeader: '',
        addModalType: '',
        sowBreadcrumbsArr: [plans[selectedPlanIndex].title]
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    //Ref Hooks for Materialize functionality
        //Ref hook for the substep tabs directly under the project
    const collapsibleProject = useRef(null);
    const addModal = useRef(null);
    /**
     * Effect hooks
     */
        //Initialze Materialize collapsible for main plan level
    useEffect(() => {
        const collapsibleOptions = { accordion: false };
        M.Collapsible.init(collapsibleProject.current, collapsibleOptions);
    },[]);
        //Intitialzes Materialize modal; Runs on initial render only
    useEffect(() => {
        const addModalOptions = {
            opacity: 0,
            preventScrolling: false,
            dismissable: true,
        };
        M.Modal.init(addModal.current, addModalOptions);
    }, []);

    useEffect(() => {

    }, [state.sowBreadcrumbsArr])
    //Sets the state and info to render the add modal for the desired section
    function openAddModal(e) {
        const addModalInstance = M.Modal.getInstance(addModal.current);
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
    async function addNewSection(addModalValue, addModalCheckTypeValue) {
        const parentId = selectedSowId;
        let sowObj;
        if (selectedSowId === plans[selectedPlanIndex].id) {
            sowObj = plans[selectedPlanIndex]
        } else {
            sowObj = getSowObj(plans[selectedPlanIndex].sub_plans)
        }
        let updatedFieldObj;
        //Needs to account for being under different levels
        if (addModalValue.trim().length > 0) {
            switch (state.addModalType) {
                case 'substep':
                    await postPlan({
                        title: addModalValue,
                        parent: parentId,
                        notes: []
                    })
                    const updatedUserPlans = await getUserPlans()
                    contextDispatch({type:'field', field: 'plans', payload: updatedUserPlans})
                    break;
                case 'checklist':
                    const newChecks = [
                        ...sowObj.checks,
                        {
                            title: addModalValue,
                            list_type: addModalCheckTypeValue,
                        }
                    ];
                    updatedFieldObj = { checks:newChecks  };
                    savePlanChanges(parentId, updatedFieldObj);
                    break;
                default:
            }
        }
    }

    function updateNotes(isNewNote, newNoteObj) {
        let updatedNotes;
        if (isNewNote) {
            updatedNotes = [].concat(
                [...plans[selectedPlanIndex].notes]
            );
            updatedNotes.push(newNoteObj);
        } else {
            updatedNotes = newNoteObj;
        }
        savePlanChanges(contextState.selectedPlanId, {
            notes: updatedNotes,
        });
    }

    function selectSubPlan (stepId, stepTitle, e) {
        switch (e.currentTarget.id) {
            case 'sow-back-btn':
                dispatch({type:'breadcrumb', field:'back' , payload:stepTitle})
                break;
            default:
                dispatch({type:'breadcrumb', field:'add' , payload:stepTitle})
        }

        contextDispatch({type:'field', field:'selectedSowId', payload:stepId});
    }

    function deleteSubPlan (id) {
        console.log("Sub Plan " + id + " to be deleted");
    }
    //Not currently implemented - Refactor to change titles or order from the parent display screen
    // function updateSubPlan(index, newSubPlanObj) {
    //     const updatedSubPlans = [].concat(
    //         [...plans[selectedPlanIndex].sub_plans]
    //     );
    //     updatedSubPlans[index] = newSubPlanObj;
    //     savePlanChanges(contextState.selectedPlanId, {
    //         sub_plans: updatedSubPlans,
    //     });
    // }
    //Delete function for fields directly under a plan object: sub_plans, notes, checks
    async function deleteItemInPlan(itemFieldName, itemIndex) {
        const currentPlan = {...plans[selectedPlanIndex]};
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
        try {
            await savePlanChanges(contextState.selectedPlanId, updateObj)
        } catch (error) {
            console.log(error);
        }
    }

    const makeSowNav = () => {
        return (
            <nav className="transparent z-depth-0">
                <div className="nav-wrapper">
                    <div className="col s12 indigo-text">
                        {state.sowBreadcrumbsArr.map((breadcrumb, i) => {
                            return (
                                <a key={breadcrumb + i} href="#project" className="breadcrumb indigo-text">{breadcrumb}</a>
                            )
                        })}
                    </div>
                </div>
            </nav>
        )
    }
    function makeChecksSections (arr) {
        return arr.map(
            (checkObj, i) => {
                return (
                    <div key={checkObj.title + i} className='col s12 m6'>
                        <SimpleCheckboxSection
                            sowChecks={arr}
                            checkIndex={i}
                            savePlanChanges = {savePlanChanges}
                        />
                    </div>
                );
            }
        );
    }
    const saveToSowImages = (photosArr, newParentFolderId) => {
        if (newParentFolderId) {
            savePlanChanges(selectedSowId, {google_drive_folder_id: newParentFolderId,images: photosArr})
        } else {
            savePlanChanges(selectedSowId, {images: photosArr})
        }

    }
    const makeSelectedProjectUl = (sowObj) => {
        return (
            <ul
                ref={collapsibleProject}
                className='collapsible expandable z-depth-0'
            >
                <li
                    id={sowObj.id}
                    className='collection-header indigo-text center row valign-wrapper'
                >
                    <div className='col s1'>
                        {
                            (selectedSowId !== plans[selectedPlanIndex].id)
                            &&
                            <button
                                id='sow-back-btn'
                                type='button'
                                className='waves-effect waves-blue btn-flat'
                                onClick={(e) => {
                                    selectSubPlan(sowObj.parent, sowObj.title, e);
                                }}
                            >
                                <i className='material-icons left indigo-text'>
                                    arrow_back
                                </i>
                            </button>
                        }
                    </div>
                    <div className='col s10'>
                        {makeSowNav()}
                    </div>
                    <div className='col s1'>
                        <i className='small material-icons red-text text-accent-4'>
                            edit
                        </i>
                    </div>
                </li>
                <li>
                    <div className='collapsible-header indigo-text'>
                        <i className='material-icons center indigo-text'>
                            note
                        </i>
                        <b>Notes</b>
                    </div>
                    <div className='collapsible-body indigo-text'>
                        <NotesSection
                            updateNotes={updateNotes}
                            notes={sowObj.notes}
                            deleteItemInPlan={deleteItemInPlan}
                        />
                    </div>
                </li>
                <li className='active'>
                    <div className='collapsible-header indigo-text'>
                        <i className='material-icons center indigo-text'>
                            video_library
                        </i>
                        <b>Videos</b>
                    </div>
                    <div className='collapsible-body'>
                        <UrlLinks
                            planId={sowObj.id}
                            savePlanChanges={savePlanChanges}
                            videoUrls={sowObj.video_urls}
                        />
                    </div>
                </li>
                <li className='active'>
                    <div className='collapsible-header indigo-text'>
                        <i className='material-icons center indigo-text'>
                            bookmark
                        </i>
                        <b>Bookmarked Sites</b>
                    </div>
                    <div className='collapsible-body'>
                        <Bookmarks
                            bookmarks = {sowObj.bookmarks}
                            savePlanChanges={savePlanChanges}
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
                                {makeChecksSections(sowObj.checks)}
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
                        {sowObj.sub_plans.length > 0 &&
                            sowObj.sub_plans.map((subPlan, i) => {
                                return (
                                    <li key={subPlan.id} className='collection-item'>
                                        <div className='indigo-text text-darken-3'>
                                            <a
                                                href='#subplannotebook'
                                                className='waves-effect waves-light btn-flat indigo-text text-darken-3'
                                                onClick={(e) => selectSubPlan(subPlan.id, subPlan.title, e)}
                                            >
                                                <h6 className='valign-wrapper'>
                                                    {subPlan.title}
                                                    <i className='material-icons'>chevron_right</i>
                                                </h6>
                                            </a>

                                            <button
                                                className='btn-flat center-align right waves-effect waves-light  hide-on-small-and-down '
                                                onClick={() => {
                                                    deleteSubPlan(subPlan.id);
                                                }}
                                            >
                                                <i className='material-icons grey-text text-lighten-4'>delete_forever</i>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })
                        }
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
                                    <ProjectPictures
                                        mainDriveFolderId={mainDriveFolderId}
                                        createDriveFolder={createDriveFolder}
                                        saveToSowImages={saveToSowImages}
                                        sowTitle={sowObj.title}
                                        projectGdriveFolderId={sowObj.google_drive_folder_id}
                                        photos={sowObj.images}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </li>
                <li className='active'>
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
        )
    };

    let selectedProjectUl;
    if (contextState.selectedSowId === contextState.plans[contextState.selectedPlanIndex].id) {
        selectedProjectUl = makeSelectedProjectUl(contextState.plans[contextState.selectedPlanIndex])
    } else {
        selectedProjectUl = makeSelectedProjectUl(getSowObj(contextState.plans[contextState.selectedPlanIndex].sub_plans))
    }

    return (
        <div>
            <div className='col s12'>
                <div className='row'>
                    <div className='col s12'>
                        <button
                            type='button'
                            className='waves-effect waves-blue btn-flat'
                            onClick={() => {
                                handleMainAppView('HomePage');
                                contextDispatch({type:'field', field:'selectedSowId', payload:null})
                            }}
                        >
                            <i className='material-icons left indigo-text'>
                                home
                            </i>
                        </button>
                        <button
                            className='btn waves-effect waves-light indigo'
                            type='button'
                            name='action'
                            onClick={() =>
                                handleMainAppView('SearchResults')
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
                                    {selectedProjectUl}
                                </div>
                            </div>
                            </div>
                        </div>
                        <PlanDetailsMenu
                            userPlans={contextState.plans}
                            selectedPlanIndex={contextState.selectedPlanIndex}
                            savePlanChanges={savePlanChanges}
                            handleMainAppView={handleMainAppView}
                            openAddModal={openAddModal}
                        />}
                    </div>
                    <div
                        ref={addModal}
                        id={'add-modal' + plans[selectedPlanIndex].title}
                        className='modal'
                    >
                        <AddModal
                            addModalHeader={state.addModalHeader}
                            addModalType={state.addModalType}
                            addNewSection={addNewSection}
                        />
                    </div>
                </div>
            </div>
    );
}

export default ProjectLevel;
/**
<ul
    ref={collapsibleProject}
    className='collapsible expandable z-depth-0'
>
    <li
        id={plans[selectedPlanIndex].id}
        className='collection-header indigo-text center'
    >
        <h6>
            <b>
                {plans[selectedPlanIndex].title}
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
                notes={plans[selectedPlanIndex].notes}
                deleteItemInPlan={deleteItemInPlan}
            />
        </div>
    </li>
    <div className='active'>
        <UrlLinks
            planId={plans[selectedPlanIndex].id}
            savePlanChanges={savePlanChanges}
            videoUrls={plans[selectedPlanIndex].video_urls}
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
                savePlanChanges={savePlanChanges}
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
                    {makeChecksSections(plans[selectedPlanIndex].checks)}
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
            {plans[selectedPlanIndex].sub_plans.length > 0 &&
                plans[selectedPlanIndex].sub_plans.map((subPlan, i) => {
                    return (
                        <li key={subPlan.id} className='collection-item'>
                            <div className='indigo-text text-darken-3'>
                                <a
                                    href='#subplannotebook'
                                    className='waves-effect waves-light btn-flat indigo-text text-darken-3'
                                    onClick={() => selectSubPlan(subPlan)}
                                >
                                    <h6 className='valign-wrapper'>
                                        {subPlan.title}
                                        <i className='material-icons'>chevron_right</i>
                                    </h6>
                                </a>

                                <button
                                    className='btn-flat center-align right waves-effect waves-light  hide-on-small-and-down '
                                    onClick={() => {
                                        deleteSubPlan(subPlan.id);
                                    }}
                                >
                                    <i className='material-icons grey-text text-lighten-4'>delete_forever</i>
                                </button>
                            </div>
                        </li>
                    );
                })
            }
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
 */
