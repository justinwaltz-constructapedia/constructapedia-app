//Import React and hooks used
import React, { useState, useEffect } from 'react';

//Functional Component
//Handles the view for each check list
//DATABASE NOTE: Plan -> checks -> check_list -> check
function SimpleCheckboxSection(props) {
    //State Hooks
    //Holds the text input value for adding a new item to the check list
    const [newItemValue, setNewItemValue] = useState('');
    //Holds the vaules for each indiviual check within the check list to use in editing properties
    const [checksObjs, setChecksObjs] = useState({});
    //Formats the list_type property for display in html
    const displayListType = props.listType
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());

    //Effect Hooks
    //Sets the state of the checksObjs
    //Runs on a change to the checklist passed to the component
    useEffect(() => {
        //Copies the checklist array prop
        const checksToSet = [].concat(props.checklist);
        //Sets the state with a reduced array of objects to store relevent values for each check
        setChecksObjs(
            checksToSet.reduce(
                (options, option) => ({
                    ...options,
                    [option.text_value]: {
                        is_complete: option.is_complete,
                        quantity: option.quantity,
                        unit_of_measure: option.unit_of_measure,
                    },
                }),
                {}
            )
        );
    }, [props.checklist]);
    //Processes the various changes of input in the component parts
    function handleInputChange(event, index) {
        //Where the event occured
        const target = event.target;
        //Info from the event
        const { name, value } = target;
        //Handle the clicking of a checkbox
        if (target.type === 'checkbox') {
            //Update the check clicked
            const updatedChecks = (prevChecks) => {
                const newChecksObjs = {
                    ...prevChecks,
                    [name]: {
                        ...prevChecks[name],
                        is_complete: !prevChecks[name].is_complete,
                    },
                };
                return newChecksObjs;
            };
            //Set the state of the checksObjs
            setChecksObjs((prevChecksObjs) => updatedChecks(prevChecksObjs));
            console.log(props.checklist);
            //Send request to update the database
            const newChecks = [].concat(props.checklist);
            console.log(newChecks);
            const checkedAttribute = target.checked;
            //NOTE: could be simplified with index parameter now?
            const indexOfCheckToChange = newChecks.findIndex(
                (check) => check.text_value === name
            );
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            //NOTE: Needs to be moved so that it make call for unit and quantity
            //NOTE: Take out the "action" param and just use index -1 for create
            props.updateChecklist(
                props.checklistIndex,
                'updateItem',
                newChecks
            );
            //Handle changes in the the quantity field
            //NOTE: Not currently an option
        } else if (target.id.includes('quantity')) {
            const itemToUpdate = props.checklist[index];
            console.log(itemToUpdate, value);
            const updatedChecks = (prevChecks) => {
                const newChecksObjs = {
                    ...prevChecks,
                    [name]: {
                        is_complete: prevChecks[name].is_complete,
                        quantity: value,
                        unit_of_measure: prevChecks[name].unit_of_measure,
                    },
                };
                return newChecksObjs;
            };
            setChecksObjs((prevChecksObjs) => updatedChecks(prevChecksObjs));
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
        } else {
            setNewItemValue(value);
        }
    }

    //NOTE: Make part of the props.addNewItem?
    function addNewChecklistItem(e) {
        if (newItemValue.trim().length > 0) {
            const newCheck = {
                text_value: newItemValue,
                is_complete: false,
            };
            console.log(newCheck);
            console.log(checksObjs);
            props.updateChecklist(props.checklistIndex, 'addItem', [newCheck]);
            setNewItemValue('');
        }
    }
    function removeChecklistItem(indexOfCheckToRemove) {
        const newChecksArr = props.checklist.reduce((checks, check, i) => {
            if (i !== indexOfCheckToRemove) {
                checks.push(check);
            }
            return checks;
        }, []);
        console.log(newChecksArr);
        props.updateChecklist(props.checklistIndex, 'updateItem', newChecksArr);
    }
    function makeListOfCheckboxElements(arr) {
        return arr.map((listItem, i) => {
            if (checksObjs[listItem.text_value]) {
                return (
                    <CheckListItem
                        key={i + listItem.text_value}
                        listType={props.listType}
                        listItem={listItem}
                        checked={checksObjs[listItem.text_value].is_complete}
                        handleInputChange={handleInputChange}
                        itemIndex={i}
                        removeChecklistItem={removeChecklistItem}
                    />
                );
            } else {
                return null;
            }
        });
    }
    const checkboxElements = makeListOfCheckboxElements(props.checklist);

    return (
        <div className='col s12 l6'>
            <div className='row valign-wrapper'>
                <div className=''>
                    <div className='input-field inline'>
                        <input
                            id={
                                'new-' +
                                props.listType +
                                '-' +
                                props.checklistIndex
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
                            props.listType +
                            '-btn-' +
                            props.checklistIndex
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
                            props.deleteItemInPlan(
                                'checks',
                                props.checklistIndex
                            )
                        }
                    >
                        <i className='material-icons '>delete_forever</i>
                    </button>
                </div>
            </div>
            <ul className='collection with-header'>
                <li className='collection-header indigo-text center'>
                    {props.listTitle}{' '}
                </li>
                <li className='collection-item'>{checkboxElements}</li>
                {props.import_url && (
                    <li className='collection-item'>
                        Imported From:
                        <div className='truncate'>{props.import_url}</div>
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
                <div className='col s12 left-align'>
                    <label className='left-align active'>
                        <input
                            type='checkbox'
                            name={props.listItem.text_value}
                            checked={props.checked}
                            onChange={(e) =>
                                props.handleInputChange(e, props.itemIndex)
                            }
                            className='filled-in'
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
                            checked={props.checked}
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
/*<div className='col s3'>
  <div className='input-field no-margin no-padding'>
    <input
      id={'quantity' + i}
      type='number'
      className='validate no-margin no-padding'
      value={props.listItem.quantity}
      placeholder='Need'
      onChange={(e) => handleInputChange(e, i)}
    />
  </div>
</div>
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
</div>*/
