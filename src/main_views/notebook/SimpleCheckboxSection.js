import React, { useState, useEffect } from 'react';

function SimpleCheckboxSection(props) {
    const initialCheckboxes = props.checklist.reduce(
        (options, option) => ({
            ...options,
            [option.text_value]: {is_complete: option.is_complete, quantity: option.quantity,unit_of_measure: option.unit_of_measure},
        }),
        {}
    );
    const [newItemValue, setNewItemValue] = useState('');
    //const [checkboxes, setCheckboxes] = useState();
    const [checksObjs, setChecksObjs] = useState(initialCheckboxes);
    const checkboxElements = makeListOfCheckboxElements(props.checklist);
    const displayListType = props.listType
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());

    useEffect(() => {
        const checksToSet = props.checklist;
        // setCheckboxes(
        //     checksToSet.reduce(
        //         (options, option) => ({
        //             ...options,
        //             [option.text_value]: option.is_complete
        //         }),
        //         {}
        //     )
        // );
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

    function handleInputChange(event, index) {
        const target = event.target;
        // const value = target.value;
        const { name, value } = target;
        if (target.type === 'checkbox') {
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
            setChecksObjs((prevChecksObjs) => updatedChecks(prevChecksObjs));
            console.log(props.checklist);
            const newChecks = [].concat(props.checklist);
            console.log(newChecks);
            const checkedAttribute = target.checked;
            //could be simplified with index parameter now
            const indexOfCheckToChange = newChecks.findIndex(
                (check) => check.text_value === name
            );
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            //Needs to be moved so that it make call for unit and quantity
            //Take out the "action" param and just use index -1 for create
            props.updateChecklist(props.checklistIndex, "addItem", newChecks)
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
        } else {
            setNewItemValue(value);
        }
    }

  function makeListOfCheckboxElements(arr) {
    if (props.listType === 'materials') {
        return arr.map((listItem, i) => {
            //add checked="checked" attribute to the input, make the onChange effect the db
            return (
                <div key={props.listType + i} className='row valign-wrapper'>
                    <div className='col s12 left-align'>
                        <label className='left-align active'>
                            <input
                                type='checkbox'
                                name={listItem.text_value}
                                checked={checksObjs[listItem.text_value].is_complete}
                                onChange={(e) => handleInputChange(e,i)}
                                className='filled-in'
                            />
                            <span>{listItem.text_value}</span>
                        </label>
                    </div>
                    {/*<div className='col s3'>
                      <div className='input-field no-margin no-padding'>
                        <input
                          id={'quantity' + i}
                          type='number'
                          className='validate no-margin no-padding'
                          value={listItem.quantity}
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
                          value={listItem.unit_of_measure}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </div>
                    </div>*/}
                </div>
            );
        });
        } else if (props.listType === 'tools') {
            return arr.map((listItem, i) => {
                return (
                    <div key={props.listType + i} className='row valign-wrapper'>
                        <div className='col s12 left-align'>
                            <label className='left-align active'>
                                <input
                                    type='checkbox'
                                    className='filled-in'
                                    name={listItem.text_value}
                                    checked={checksObjs[listItem.text_value].is_complete}
                                    onChange={(e) => handleInputChange(e, i)}
                                />
                                <span>{listItem.text_value}</span>
                            </label>
                        </div>
                    </div>
                );
            });
        }
  }

  //Make part of the props.addNewItem
  function addNewChecklistItem() {
    const newChecks = [].concat(props.checklist);
    if (newItemValue.trim().length > 0) {
        const newCheck = {
            text_value: newItemValue,
            //is_complete:
        };
        newChecks.push(newCheck);
        console.log(newChecks);
        props.updateChecklist(props.checklistIndex, 'addItem', [newCheck]);
        setNewItemValue('');
    }
  }
  return (
    <div className='col s6'>
        <div>
            <div className='input-field inline'>
                <input
                    id={'new-' + props.listType + '-' + props.checklistIndex}
                    type='text'
                    className='validate'
                    value={newItemValue}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            addNewChecklistItem();
                        }
                    }}
                    placeholder={'Add New ' + displayListType}
                />
            </div>
            <button
                id={'add-' + props.listType + '-btn-' + props.checklistIndex}
                className='btn-floating btn-small waves-effect waves-light'
                type='button'
                onClick={addNewChecklistItem}
            >
                <i className='material-icons'>add</i>
            </button>
        </div>
        <ul className='collection with-header'>
            <li className='collection-header indigo-text center'>
                {props.listTitle}{' '}
            </li>
            <li className='collection-item'>{checkboxElements}</li>
        </ul>
    </div>
  );
}

export default SimpleCheckboxSection;
