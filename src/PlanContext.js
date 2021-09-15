import React, {useReducer, createContext, useEffect} from 'react';
import { getUserPlans } from './api/projectsApi';

export const PlanContext = createContext();

function init() {
    return {
        plans: [],
        selectedPlanIndex: null,
        isSaving: false,
        error: ''
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
            return {
                ...state,
                [action.field]: action.payload
            };
        case 'addItem':
            return {
                ...state,
                plan: {
                    ...state.plan,
                    [action.field]: action.payload[action.field]
                    //[action.field]: state.plan[action.field].push(action.payload)
                }
            }
        case 'delete':
            return {
                ...state,
                plans:{
                    ...state.plans,
                    [action.field]: state.plans[action.field].filter((_, index) => index !== action.payload)
                }
            }
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
    const [contextState, contextDispatch] = useReducer(reducer, [], init)

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
