import React, { useState, useEffect, useRef } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import SimpleCheckboxSection from './SimpleCheckboxSection.js';
import NotesSection from './NotesSection.js';
import ProjectStepsSection from './ProjectStepsSection.js';
import UrlLinks from './UrlLinks.js';
import './ProjectLevel.css';
import SearchResults from '../SearchResults';

function ProjectLevel(props) {
    //Ref hook for the substep tabs directly under the project
    const substepTabsUl = useRef(null);
    const collapsibleProject = useRef(null);
    //Effect hooks
    //Hook for intializing the substep tab functionality using Materialize
    useEffect(() => {
        if (props.userPlans[props.selectedPlanIndex].sub_plans.length > 0) {
            const tabsOptions = {
                swipeable: true,
            };
            M.Tabs.init(substepTabsUl.current, tabsOptions);
        }
    });
    //Initialze Materialize collapsible for main plan level
    useEffect(() => {
        const collapsibleOptions = { accordion: false };
        M.Collapsible.init(collapsibleProject.current, collapsibleOptions);
    });

    // useEffect(() => {
    //     setSelectedLevel(props.userPlans[props.selectedPlanIndex].id);
    // }, [props.userPlans, props.selectedPlanIndex]);

    function updateChecklist(checklistIndex, action, itemArr, itemIndex) {
        //NOTE: Change this to a reduce function in the switch?
        const currentChecks = [].concat(
            props.userPlans[props.selectedPlanIndex].checks
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
                props.savePlanChanges(
                    props.userPlans[props.selectedPlanIndex].id,
                    {
                        checks: newChecks,
                    }
                );
                break;
            case 'updateItem':
                currentChecks[checklistIndex].list = itemArr;
                props.savePlanChanges(
                    props.userPlans[props.selectedPlanIndex].id,
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
                props.userPlans[props.selectedPlanIndex].notes
            );
            updatedNotes.push(newNoteObj);
        } else {
            updatedNotes = newNoteObj;
        }
        props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {
            notes: updatedNotes,
        });
    }

    function updateSubPlan(index, newSubPlanObj) {
        const updatedSubPlans = [].concat(
            props.userPlans[props.selectedPlanIndex].sub_plans
        );
        updatedSubPlans[index] = newSubPlanObj;
        props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {
            sub_plans: updatedSubPlans,
        });
    }
    const videoDisplays = props.userPlans[
        props.selectedPlanIndex
    ].video_urls.map((url, i) => {
        return (
            <div key={i} className='video-container'>
                <iframe
                    title='video1'
                    src={url}
                    frameBorder='0'
                    allowFullScreen
                ></iframe>
            </div>
        );
    });
    const checksSections = props.userPlans[props.selectedPlanIndex].checks.map(
        (checkObj, i) => {
            return (
                <div key={checkObj.title + i} className='col s12 m6'>
                    <SimpleCheckboxSection
                        checklist={checkObj.list}
                        listType={checkObj.list_type}
                        listTitle={checkObj.title}
                        checklistIndex={i}
                        updateChecklist={updateChecklist}
                        deleteItemInPlan={props.deleteItemInPlan}
                    />
                </div>
            );
        }
    );
    // const createSubstepTabs = () => {
    //
    // }
    const substepTabs = props.userPlans[props.selectedPlanIndex].sub_plans.map(
        (subPlan, i) => {
            return (
                <li key={subPlan.id} className='tab col s3'>
                    <a href={'#' + subPlan.id}>{subPlan.title}</a>
                </li>
            );
        }
    );

    const substepSections = props.userPlans[
        props.selectedPlanIndex
    ].sub_plans.map((subPlan, i) => {
        return (
            <div key={subPlan.title + i} id={subPlan.id} className='col s12'>
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
                                planId={
                                    props.userPlans[props.selectedPlanIndex].id
                                }
                                savePlanChanges={props.savePlanChanges}
                                deleteItemInPlan={props.deleteItemInPlan}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className='col s12'>
            <div className='row'>
                <ul
                    ref={collapsibleProject}
                    className='collapsible expandable z-depth-0'
                >
                    <li
                        id={props.userPlans[props.selectedPlanIndex].id}
                        className='collection-header indigo-text center'
                    >
                        <h6>
                            <b>
                                {props.userPlans[props.selectedPlanIndex].title}
                            </b>{' '}
                            <i className='tiny material-icons red-text text-accent-4'>
                                edit
                            </i>
                        </h6>
                    </li>
                    <div className='center-align'>
                        <UrlLinks
                            planId={props.userPlans[props.selectedPlanIndex].id}
                            savePlanChanges={props.savePlanChanges}
                            videoUrls={
                                props.userPlans[props.selectedPlanIndex]
                                    .video_urls
                            }
                        />
                    </div>
                    <li>
                        <div className='collapsible-header indigo-text'>
                            <i className='material-icons center'>create</i>
                            <b>Quick Notes</b>
                        </div>
                        <div className='collapsible-body'>
                            <NotesSection
                                updateNotes={updateNotes}
                                notes={
                                    props.userPlans[props.selectedPlanIndex]
                                        .notes
                                }
                                deleteItemInPlan={props.deleteItemInPlan}
                            />
                        </div>
                    </li>
                    <li className=''>
                        <div className='collapsible-header red-text text-accent-4'>
                            <i className='material-icons center'>bookmark</i>
                            <b>Bookmarked Sites</b>
                        </div>
                        <div className='collapsible-body'>
                            <section>
                                <table className='striped'>
                                    <thead>
                                        <tr>
                                            <th className='indigo-text'>
                                                Page Title
                                            </th>
                                            <th className='indigo-text'>
                                                Link
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='red-text'>
                                                Please activate me
                                            </td>
                                            <td className='red-text'>
                                                {' '}
                                                www.JustinYourMyHero.com
                                            </td>
                                            <td>
                                                <a
                                                    href='#!'
                                                    className='right btn red accent-4'
                                                >
                                                    <i className=' material-icons'>
                                                        border_color
                                                    </i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                    {/*<li className=''>
                        <div className='collapsible-header indigo-text'>
                            <i className='material-icons center indigo-text'>
                                assignment
                            </i>
                            <b>Project Tools</b>
                        </div>
                        <div className='collapsible-body'>
                            <section className='section section-content'>
                                <div className='row'>
                                    <div className='col s12 m6 l8'>
                    <div className='card-panel'>
                      <div
                        id='contentViewer'
                        className='content-viewer red-text'
                      >
                        Content Viewer
                        {props.userPlans[props.selectedPlanIndex].video_urls
                          .length > 0 && videoDisplays}
                      </div>
                    </div>
                        </div>

                                    
                                    </div>
                                    <div className='col s12 m6'>
                                        <div className='card red-text accent-4 center'>
                                            <i className='material-icons'>
                                                camera
                                            </i>
                                            <p>Attachments(Camera for Phone)</p>
                                        </div>
                                    </div>
                                    <div className='col s12 m6'>
                                        <div className='card center red-text accent-4'>
                                            <i className='material-icons'>
                                                playlist_add_check
                                            </i>
                                            <p>Check List</p>
                                        </div>
                                    </div>
                                    <div className='col s12 m6'>
                                        <div className='card center red-text accent-4'>
                                            <p>Work Steps</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </li>*/}
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
                                    {props.userPlans[props.selectedPlanIndex]
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
                            {!props.reload && (
                                <>
                                    <ul
                                        ref={substepTabsUl}
                                        id='substep-tabs-swipe'
                                        className='tabs'
                                    >
                                        {substepTabs}
                                    </ul>
                                    {substepSections}
                                </>
                            )}
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
                    {/*<li>
            <div className='collapsible-header'>
              <b>Lessons Learned</b>
            </div>
            <div className='collapsible-body'></div>
          </li>*/}
                </ul>
            </div>
        </div>
    );
}

export default ProjectLevel;
// <ul>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">filter_drama</i>First</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">place</i>Second</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
//     <li>
//       <div className="collapsible-header"><i className="material-icons">whatshot</i>Third</div>
//       <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
//     </li>
// </ul>
