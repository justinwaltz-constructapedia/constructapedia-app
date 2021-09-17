//Import React and hooks used
import React, { useContext, useReducer, useEffect } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'

function init(initialList) {
    return {
        list: initialList,
        newItemValue: '',
        editItemValue: '',
        isSaving: false,
        isEditing: false,
        indexToEdit: -1,
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
                ...state,
                list: state.list.filter((_, index) => index !== action.payload)
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
function SimpleCheckboxSection({checklist, listType, listTitle, checklistIndex, import_url, savePlanChanges}) {
    //Formats the list_type property for display in html
    const displayListType = listType.trim().replace(/^\w/, (c) => c.toUpperCase());
    /**
     * useContext Hook
     */
    const [contextState] = useContext(PlanContext);
    /**
     * useReducer Hook
     */
    //NOTE: Is State/Reducer needed since savePlanChanges updates context state?
    const [state, dispatch] = useReducer(reducer, checklist, init);
    const {list, newItemValue, editItemValue, isSaving, isEditing, indexToEdit, error} = state;
    useEffect(() => {
        console.log("SimpleCheckboxSection useEffect",list);
    })
    function createAndSaveUpdatedChecks (newList) {
        const updatedChecks = [].concat(contextState.plans[contextState.selectedPlanIndex].checks);
        updatedChecks[checklistIndex].list = newList;
        savePlanChanges(contextState.plans[contextState.selectedPlanIndex].id, { checks: updatedChecks });
    }
    //Processes the various changes of input in the component parts
    function handleInputChange(e, index) {
        //Where the event occured
        const target = e.target;
        //Handle the clicking of a checkbox
        if (target.type === 'checkbox') {
            const updatedList = list.map((item, i) => {
                if (i === index) {
                    const newItem = {...item}
                    newItem.is_complete = !list[index].is_complete
                    return newItem;
                } else {
                    return item;
                }
            });
            //Update the check clicked
            dispatch({type:'field', field:'list', payload:updatedList})
            //Send request to update the database
            createAndSaveUpdatedChecks(updatedList);
        } else if (target.id.includes('quantity') && Number(target.value)) {
            const updatedList = list.map((item, i) => {
                if (i === index) {
                    const newItem = {
                        ...item,
                        quantity: target.value
                    }
                    return newItem;
                } else {
                    return item;
                }
            });
            //Update the item quantity in state
            dispatch({type:'field', field:'list', payload:updatedList})
            //Send request to update the database
            createAndSaveUpdatedChecks(updatedList);
        } else {
            dispatch({type:'field', field:'newItemValue', payload: target.value});
        }
    }

    //NOTE: Make part of the props.addNewItem?
    function addNewChecklistItem(e) {
        if (newItemValue.trim().length > 0) {
            const newCheck = {
                text_value: newItemValue,
                is_complete: false,
            };
            const updatedList = [...list, newCheck];
            console.log("updated list", updatedList);
            //Update the check clicked
            createAndSaveUpdatedChecks(updatedList);
            dispatch({type:'field', field:'list', payload:updatedList})
            dispatch({type:'field', field:'newItemValue', payload:''});
        } else {
            alert('Please enter a new checklist item.')
        }
    }
    function removeChecklistItem(indexOfCheckToRemove) {
        const updatedList = list.reduce((checks, check, i) => {
            if (i !== indexOfCheckToRemove) {
                checks.push(check);
            }
            return checks;
        }, []);
        createAndSaveUpdatedChecks(updatedList);
        dispatch({type:'field', field:'list', payload:updatedList})
    }
    function makeListOfCheckboxElements(arr) {
        return arr.map((listItem, i) => {
            if (list[i]) {
                return <CheckListItem
                        key={i + listItem.text_value}
                        listType={listType}
                        listItem={listItem}
                        handleInputChange={handleInputChange}
                        itemIndex={i}
                        removeChecklistItem={removeChecklistItem}
                    />
            } else {
                return null;
            }
        });
    }
    const checkboxElements = makeListOfCheckboxElements(list);

    return (
        <div className='col s11'>
            <div className='row valign-wrapper'>
                <div className=''>
                    <div className='input-field inline'>
                        <input
                            id={
                                'new-' +
                                listType +
                                '-' +
                                checklistIndex
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
                            listType +
                            '-btn-' +
                            checklistIndex
                        }
                        className='btn-small waves-effect waves-light indigo'
                        type='button'
                        onClick={(e) => addNewChecklistItem(e)}
                    >
                        <i className='material-icons'>add</i>
                    </button>
                </div>
                <div className='col s2'>
                    <button
                        className='btn-flat right waves-effect waves-light grey-text text-lighten-3'
                        type='button'
                        onClick={() =>
                            console.log('delete')
                            // props.deleteItemInPlan(
                            //     'checks',
                            //     checklistIndex
                            // )
                        }
                    >
                        <i className='material-icons '>delete_forever</i>
                    </button>
                </div>
            </div>
            <ul className='collection with-header'>
                <li className='collection-header indigo-text center'>
                    {listTitle}{' '}
                </li>
                <li className='collection-item'>{checkboxElements}</li>
                {import_url && (
                    <li className='collection-item'>
                        Imported From:
                        <div className='truncate'>{import_url}</div>
                    </li>
                )}
            </ul>
        </div>
    );
}

function CheckListItem(props) {
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


    //Handle changes in the the unit field
    //NOTE: Not currently an option
} else if (target.id.includes('unit')) {
    const itemToUpdate = props.checklist[index];
    console.log(itemToUpdate, value);
    const updatedChecks = (prevChecks) => {
        const newChecksObjs = {
            ...prevChecks,
            [name]: {
                is_complete: prevChecks[name].is_complete,
                quantity: prevChecks[name].quantity,
                unit_of_measure: value,
            },
        };
        return newChecksObjs;
    };
    setChecksObjs((prevChecksObjs) => updatedChecks(prevChecksObjs));
    //Handle changes in new item input
*/
