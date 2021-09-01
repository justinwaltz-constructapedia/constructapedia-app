// import React, {  useEffect, useRef, useState, useReducer } from 'react';
//
// import M from 'materialize-css';
// import 'materialize-css/dist/css/materialize.min.css';
// import SimpleCheckboxSection from './SimpleCheckboxSection.js';
// import NotesSection from './NotesSection.js';
// import ProjectStepsSection from './ProjectStepsSection.js';
// // import UrlLinks from './UrlLinks.js';
// import {putPlanUpdate} from './api/projectsApi';
// // getUserPlans, deletePlan, postPlan,
// import './ProjectLevel.css';
//
// function init(initialPlan) {
//     return {
//         plan: initialPlan,
//         newBookmarkValue: '',
//         newBookmarkTitleValue: '',
//         isSaving: false,
//         error: ''
//     }
// }
// function reducer (state, action) {
//     switch (action.type) {
//         case 'saving':
//             return {
//                 ...state,
//                 error: '',
//                 isSaving: true
//             };
//         case 'field':
//             return {
//                 ...state,
//                 [action.fieldName]: action.payload
//             }
//         case 'addItem':
//             return {
//                 ...state,
//                 [action.field]: state[action.field].push(action.payload)
//             };
//         case 'error':
//             return {
//                 ...state,
//                 error: action.payload,
//                 isSaving: false
//             };
//
//         default:
//             return state;
//     }
// }
//
// function PlanLevel(props) {
//     const [state, dispatch] = useReducer(reducer, props.plan, init)
//     const substepTabsUl = useRef(null);
//     const collapsibleProject = useRef(null);
//     /**
//      * [useEffect Hook for intializing the substep tab functionality using Materialize]
//      */
//     useEffect(() => {
//         if (state.plan.sub_plans.length > 0) {
//             const tabsOptions = {
//                 swipeable: true,
//             };
//             M.Tabs.init(substepTabsUl.current, tabsOptions);
//         }
//     });
//     /**
//      * [useEffect Hook for intializing collapsible for main plan level]
//      */
//     useEffect(() => {
//         const collapsibleOptions = { accordion: false };
//         M.Collapsible.init(collapsibleProject.current, collapsibleOptions);
//     });
//
//     const updateChecklist = async (checklistIndex, action, itemArr, itemIndex) => {
//         dispatch({type: saving})
//         try {
//             await putPlanUpdate(state.plan.id, state.plan)
//         } catch (error) {
//             dispatch({type: 'error', payload: error})
//         }
//     }
//
//
//     return <div>Plan Level</div>
// }
//
// // export default PlanLevel;
// //
// // (e) =>
// //                 dispatch({
// //                   type: 'field',
// //                   fieldName: 'username',
// //                   payload: e.currentTarget.value,
// //                 })
