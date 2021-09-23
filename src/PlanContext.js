import React, {useReducer, createContext, useEffect} from 'react';
import { getUserPlans } from './api/projectsApi';

export const PlanContext = createContext();

function reducer (state, action) {
    switch (action.type) {
        case 'saving':
            return {
                ...state,
                error: '',
                isSaving: true
            }
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        // case 'addItem':
        //     return {
        //         ...state,
        //         selectedSow: {
        //             ...state.selectedSow,
        //             [action.field]: action.payload[action.field]
        //             //[action.field]: state.plan[action.field].push(action.payload)
        //         }
        //     }
        // case 'selectProject':
        //     return {
        //
        //     }
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
        selectedPlanIndex: -1,
        selectedPlanId: null,
        isSaving: false,
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
