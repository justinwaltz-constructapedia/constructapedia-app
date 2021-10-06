import React, {useReducer, createContext, useEffect} from 'react';
import { getUserPlans } from './api/projectsApi';
export const PlanContext = createContext();

//Recursively finds and returns the Scope of work from in the main Projects sub_plans Arr
function getSowObj (plansArr, sowIdToFind) {
    let sowObj;
    console.log(sowIdToFind);
    for (var i = 0; i < plansArr.length; i++) {
        console.log(plansArr[i]);
        if (plansArr[i].id === sowIdToFind){
            sowObj = plansArr[i]
            break;
        } else if (plansArr[i].sub_plans && plansArr[i].sub_plans.length > 0) {
            sowObj = getSowObj(plansArr[i].sub_plans, sowIdToFind)
        } else {
            continue;
        }
    }
    return sowObj;
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
            switch (action.field) {
                case 'project':
                    selectedSowObj = state.plans.find(plan => plan.id === action.payload);
                    break;
                case 'subStep':
                    selectedSowObj = getSowObj(state.selectedSow.sub_plans, action.payload)
                    break;
                case 'back':
                    selectedSowObj = getSowObj(state.plans, action.payload);
                    // selectedSowObj = state.plans.find(plan => plan.id === action.payload);
                    // console.log('PlanContext ln53 selectedSowObj: ', selectedSowObj, 'payload: ', action.payload);
                    // if (!selectedSowObj) {
                    //     selectedSowObj = getSowObj(state.plans, action.payload);
                    //     console.log('PlanContext ln56 selectedSowObj: ', selectedSowObj);
                    // }
                    break;
                default:
                    selectedSowObj = null;
            }
            return {
                ...state,
                selectedSow: selectedSowObj,
                selectedSowId: action.payload
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
