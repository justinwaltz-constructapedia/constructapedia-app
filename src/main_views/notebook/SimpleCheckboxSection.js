//Import React and hooks used
import React, { useContext, useReducer } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'

function reducer (state, action) {
    switch (action.type) {
        case 'saving':
            return {
                ...state,
                error: '',
                isSaving: true
            }
        case 'editing':
            return {
                ...state,
                isEditing: action.payload >= 0,
                indexToEdit: action.payload
            }
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        case 'delete':
            return {
                ...state
                //list: state.list.filter((_, index) => index !== action.payload)
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

//Functional Component
//Handles the view for each check list
//DATABASE NOTE: Plan -> checks -> check_list -> check
function SimpleCheckboxSection({sowChecks, checkIndex, savePlanChanges}) {
    //Formats the list_type property for display in html
    const displayListType = sowChecks[checkIndex].list_type.trim().replace(/^\w/, (c) => c.toUpperCase());
    /**
     * useContext Hook
     */
    const [contextState] = useContext(PlanContext);
    const { selectedSowId} = contextState;

    /**
     * useReducer Hook
     */
    //NOTE: Is State/Reducer needed since savePlanChanges updates context state?
    const initialState = {
        newItemValue: '',
        editItemValue: '',
        isSaving: false,
        isEditing: false,
        indexToEdit: -1,
        error: ''
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    const { newItemValue, editItemValue, isEditing, indexToEdit} = state;

    //Processes the various changes of input in the component parts
    function handleInputChange(e, itemIndex) {
        //Where the event occured
        const target = e.target;
        const currentChecks = [...sowChecks];
        //Handle the clicking of a checkbox
        if (target.type === 'checkbox') {
            const updatedChecks = currentChecks.map((check, i) => {
                if (i === checkIndex) {
                    check.list[itemIndex].is_complete = !check.list[itemIndex].is_complete
                }
                return check;
            });
            //Send request to update the database
            savePlanChanges(selectedSowId, { checks: updatedChecks });
        } else if (target.id.includes('quantity') && Number(target.value)) {
            const updatedChecks = currentChecks.map((check, i) => {
                if (i === checkIndex) {
                    check.list[itemIndex].quantity = target.value
                }
                return check;
            });
            //Send request to update the database
            savePlanChanges(selectedSowId, { checks: updatedChecks });
        } else {
            dispatch({type:'field', field:'newItemValue', payload: target.value});
        }
    }

    //NOTE: Make part of the props.addNewItem?
    function addNewChecklistItem(e) {
        if (newItemValue.trim().length > 0) {
            const newItem = {
                text_value: newItemValue,
                is_complete: false,
                quantity: 1
            };
            const currentChecks = [...sowChecks]
            const updatedChecks = currentChecks.map((check, i) => {
                if (checkIndex === i) {
                    check.list.push(newItem)
                }
                return check;
            });
            //Update the check clicked
            savePlanChanges(selectedSowId, { checks: updatedChecks });
            dispatch({type:'field', field:'newItemValue', payload:''});
        } else {
            alert('Please enter a new checklist item.')
        }
    }
    function deleteCheckList (i) {
        const currentChecks = [...sowChecks]
        const updatedChecks = currentChecks.filter((_, index) => index !== i)
        savePlanChanges(selectedSowId, { checks: updatedChecks });
    }
    function removeChecklistItem(indexOfCheckToRemove) {
        const currentChecks = [...sowChecks]
        const updatedChecks = currentChecks[checkIndex].list.filter((_, index) => index !== indexOfCheckToRemove)
        savePlanChanges(selectedSowId, { checks: updatedChecks });
    }
    function makeListOfCheckboxElements(arr) {
        return arr.map((listItem, i) => {
            return <CheckListItem
                key={i + listItem.text_value}
                listType={sowChecks[checkIndex].list_type}
                listItem={listItem}
                handleInputChange={handleInputChange}
                itemIndex={i}
                removeChecklistItem={removeChecklistItem}
            />
        });
    }
    const checkboxElements = makeListOfCheckboxElements(sowChecks[checkIndex].list);

    return (
        <div className='col s11'>
            <div className='row valign-wrapper'>
                <div className=''>
                    <div className='input-field inline'>
                        <input
                            id={
                                'new-' +
                                sowChecks[checkIndex].list_type +
                                '-' +
                                checkIndex
                            }
                            type='text'
                            className='validate'
                            value={newItemValue}
                            onChange={(e) => handleInputChange(e)}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    addNewChecklistItem(e);
                                }
                            }}
                            placeholder={'Add New ' + displayListType}
                        />
                    </div>
                    <button
                        id={
                            'add-' +
                            sowChecks[checkIndex].list_type +
                            '-btn-' +
                            checkIndex
                        }
                        className='btn-small waves-effect waves-light indigo'
                        type='button'
                        onClick={(e) => addNewChecklistItem(e)}
                    >
                        <i className='material-icons'>add</i>
                    </button>
                </div>
            </div>
            <ul className='collection with-header'>
                <li className='collection-header indigo-text center row'>
                    <div className='col s10'>
                        {sowChecks[checkIndex].title}{' '}
                    </div>
                    <div className='col s2'>
                        { (isEditing) ?
                            <button
                                className='btn-flat right waves-effect waves-light grey-text text-lighten-3'
                                type='button'
                                onClick={() => deleteCheckList(checkIndex)}
                            >
                                <i className='material-icons '>delete_forever</i>
                            </button>
                        :
                            <i className='tiny material-icons red-text text-accent-4'
                                onClick = {()=>dispatch({type:'field', field:'isEditing', payload: true})}
                            >
                                edit
                            </i>
                        }
                    </div>
                </li>
                <li className='collection-item'>{checkboxElements}</li>
                {sowChecks[checkIndex].import_url && (
                    <li className='collection-item'>
                        Imported From:
                        <div className='truncate'>{sowChecks[checkIndex].import_url}</div>
                    </li>
                )}
            </ul>
        </div>
    );
}

function CheckListItem(props) {
    // const initialQuantity = props.listItem.quantity
    // const [itemQuantity, setItemQuantity] = useState(initialQuantity)
    if (props.listType === 'materials') {
        return (
            <div
                key={props.listType + props.itemIndex}
                className='row valign-wrapper'
            >
                <div className='col s8 left-align'>
                    <label className='left-align active'>
                        <input
                            type='checkbox'
                            name={props.listItem.text_value}
                            checked={props.listItem.is_complete}
                            onChange={(e) =>
                                props.handleInputChange(e, props.itemIndex)
                            }
                            className='filled-in'
                        />
                        <span>{props.listItem.text_value}</span>
                    </label>
                </div>
                <div className='col s2'>
                    <div className='input-field no-margin no-padding'>
                        <input
                                id={'quantity' + props.itemIndex}
                                type='number'
                                className='validate no-margin no-padding'
                                value={props.listItem.quantity}
                                placeholder='Need'
                                onChange={(e) => props.handleInputChange(e, props.itemIndex)}
                        />
                    </div>
                </div>
                <div className='col s2'>
                    <button
                        className='btn-flat right waves-effect waves-light grey-text text-lighten-3'
                        type='button'
                        onClick={() =>
                            props.removeChecklistItem(props.itemIndex)
                        }
                    >
                        <i className='material-icons'>close</i>
                    </button>
                </div>
            </div>
        );
    } else if (props.listType === 'tools') {
        return (
            <div
                key={props.listType + props.itemIndex}
                className='row valign-wrapper'
            >
                <div className='col s12 left-align'>
                    <label className='left-align active'>
                        <input
                            type='checkbox'
                            className='filled-in'
                            name={props.listItem.text_value}
                            checked={props.listItem.is_complete}
                            onChange={(e) =>
                                props.handleInputChange(e, props.itemIndex)
                            }
                        />
                        <span>{props.listItem.text_value}</span>
                    </label>
                    <button
                        className='btn-flat right waves-effect waves-light grey-text text-lighten-3'
                        type='button'
                        onClick={() =>
                            props.removeChecklistItem(props.itemIndex)
                        }
                    >
                        <i className='material-icons '>close</i>
                    </button>
                </div>
            </div>
        );
    }
}

export default SimpleCheckboxSection;
/*
<div className='col s4'>
  <div className='input-field no-margin no-padding'>
    <input
      id={'unit' + i}
      type='text'
      className='validate no-margin no-padding'
      placeholder='Unit'
      value={props.listItem.unit_of_measure}
      onChange={(e) => handleInputChange(e, i)}
    />
  </div>
</div>
*/
