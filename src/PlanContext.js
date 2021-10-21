import React, {useReducer, createContext, useEffect} from 'react';
import { getUserPlans } from './api/projectsApi';
export const PlanContext = createContext();

//Recursively finds and returns the Scope of work from in the main Projects sub_plans Arr
function getSowObj (plansArr, sowIdToFind) {
    console.log('getSowObj');
    for (const sow of plansArr) {
        if (sow.id === sowIdToFind){
            console.log("id match");
            return sow;
        } else if (sow.sub_plans && sow.sub_plans.length > 0) {
            const foundSow = getSowObj(sow.sub_plans, sowIdToFind);
            if (foundSow) {
                console.log("foundSow");
                return foundSow;
            }
        }
    }
}

function reducer (state, action) {
    switch (action.type) {
        case 'saving':
            return {
                ...state,
                error: '',
                isSaving: true
            }
        case 'field':
            if (action.field === 'plans' && state.selectedSow) {
                const selectedSowObj = getSowObj(action.payload, state.selectedSow.id);
                console.log('PlanContext ln34 selectedSow', selectedSowObj);
                return {
                    ...state,
                    [action.field]: action.payload,
                    selectedSow: selectedSowObj
                };
            } else {
                return {
                    ...state,
                    [action.field]: action.payload
                };
            }
        // case 'addImage':
        //     return {
        //         ...state,
        //         plans: {
        //             //[action.field]: state.plan[action.field].push(action.payload)
        //         }
        //     }
        case 'selectSow':
            //Recursively finds and returns the Scope of work from in the main Projects sub_plans Arr
            let selectedSowObj;
            let googleFolder = {...state.projectGdriveFolder};
            switch (action.field) {
                case 'project':
                    selectedSowObj = state.plans.find(plan => plan.id === action.payload);
                    googleFolder = {id: selectedSowObj.google_drive_folder_id, title:selectedSowObj.title};
                    break;
                case 'subStep':
                    console.log('1', state.selectedSow);
                    console.log('2', action.payload);
                    selectedSowObj = getSowObj(state.selectedSow.sub_plans, action.payload)
                    console.log('end',selectedSowObj);
                    break;
                case 'back':
                    console.log('1', state.selectedSow);
                    console.log('2', action.payload);
                    selectedSowObj = getSowObj(state.plans, action.payload);
                    break;
                default:
                    selectedSowObj = state.selectedSow;
            }
            return {
                ...state,
                selectedSow: selectedSowObj,
                selectedSowId: action.payload,
                projectGdriveFolder: googleFolder
            }
        // case 'delete':
        //     return {
        //         ...state,
        //         plans:{
        //             ...state.plans,
        //             [action.field]: state.plans[action.field].filter((_, index) => index !== action.payload)
        //         }
        //     }
        case 'error':
            return {
                ...state,
                error: action.payload,
                isSaving: false,
            }
        default:
            return state;
    }
}


export const PlanProvider = (props) => {
    //Reducer Hook
    const initialState = {
        plans: [],
        selectedSowId: null,
        selectedSow: null,
        projectGdriveFolder: {},
        error: ''
    }
    const [contextState, contextDispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        getUserPlans().then((dbUserPlans) => {
            contextDispatch({type:'field',field:'plans',payload:dbUserPlans});
        })
    },[])

    return (
        <PlanContext.Provider value={[contextState, contextDispatch]}>
            {props.children}
        </PlanContext.Provider>
    );
}
