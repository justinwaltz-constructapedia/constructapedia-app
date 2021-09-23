//Import React and hooks used
import React, { useEffect, useRef, useReducer } from 'react';
//Import Materialize functionality
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

function reducer (state, action) {
    switch (action.type) {
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        // case 'saving':
        //     return {
        //         ...state,
        //         error: '',
        //         isSaving: true
        //     }
        // case 'addItem':
        //     return {
        //         ...state,
        //         [action.field]: state.plan[action.field].push(action.payload)
        //     }
        // case 'delete':
        //     return {
        //         ...state,
        //         plan:{
        //             ...state.plan,
        //             [action.field]: state.plan[action.field].filter((_, index) => index !== action.payload)
        //         }
        //     }
        // case 'error':
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isSaving: false,
        //     }

        default:
            return state;
    }
}

function AddModal ({ addModalHeader, addModalType, subPlans, addNewSection, parentValue }) {
    const initialState = {
        addModalTitleValue: 'Untitled',
        addModalParentValue: parentValue,
        addModalCheckTypeValue: 'tools'
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    const {addModalTitleValue, addModalParentValue, addModalCheckTypeValue} = state;
    //Material <select> fields
    const addModalChecksSelect = useRef(null);

    //Intitialzes Materialize form select
    //Runs on every render
    useEffect(() => {
        M.FormSelect.init(addModalChecksSelect.current);
    });

    return (
        <>
            <div className='modal-content'>
                <h4>{addModalHeader}</h4>
                <div className='input-field'>
                    <input
                        type='text'
                        placeholder='Title'
                        id={'add-modal-title-input'}
                        className='validate'
                        value={addModalTitleValue}
                        onChange={(e) => dispatch({type:'field', field:'addModalTitleValue', payload: e.currentTarget.value})}
                    />
                </div>
                <div className='row'>
                    {addModalType === 'checklist' && (
                        <div className='input-field col s6'>
                            <select
                                id='add-modal-checks-select'
                                ref={addModalChecksSelect}
                                value={addModalCheckTypeValue}
                                onChange={(e) => dispatch({type:'field', field:'addModalCheckTypeValue', payload: e.currentTarget.value})}
                            >
                                <option value='tools'>Tools</option>
                                <option value='materials'>
                                    Materials
                                </option>
                            </select>
                            <label>Checklist Type</label>
                        </div>
                    )}
                </div>
            </div>
            <div className='modal-footer'>
                <a
                    id='addModal-add-btn'
                    href='#projectDetails'
                    className='modal-close waves-effect waves-blue btn-flat'
                    onClick={()=> addNewSection(addModalTitleValue, addModalParentValue,addModalCheckTypeValue)}
                >
                    Add
                </a>
            </div>
        </>
    )
}

export default AddModal;
