import React, {useState, useEffect} from 'react';

function SimpleCheckboxSection (props) {
    const initialCheckboxes = props.checklist.reduce(
        (options, option) => ({
            ...options,
            [option.text_value]:option.is_complete
        }),
        {}
    )
    const [newItemValue, setNewItemValue] = useState("");
    const [checkboxes, setCheckboxes] = useState(initialCheckboxes);
    const [checksObjs, setChecksObjs] = useState([]);
    const checkboxElements = makeListOfCheckboxElements(props.checklist);
    const displayListType = props.listType.trim().replace(/^\w/, (c) => c.toUpperCase());

    useEffect(() => {
        const checksToSet = props.checklist
        setCheckboxes(checksToSet.reduce(
            (options, option) => ({
                ...options,
                [option.text_value]:option.is_complete
            }),
            {}
        ))
        setChecksObjs(checksToSet.reduce(
            (options, option) => ({
                ...options,
                [option.text_value]:{quantity: option.quantity, unit_of_measure: option.unit_of_measure}
            }),
            {}
        ))
    }, [props.checklist]);

    function handleInputChange(event, index) {
        const target = event.target;
        const value = target.value;
        const { name } = target;
        if (target.type === 'checkbox'){
            const updatedChecks = (prevCheckboxes) => {
                const newChecks = {
                    ...prevCheckboxes,
                    [name]: !prevCheckboxes[name]
                }
                return newChecks
            }
            setCheckboxes(prevCheckboxes => updatedChecks(prevCheckboxes))
            const newChecks = [].concat(props.checks);
            const checkedAttribute = target.checked;
            //could be simplified with index parameter now
            const indexOfCheckToChange = newChecks.findIndex(check => check.text_value === target.name)
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            props.savePlanChanges(props.selectedPlanId, {checks:newChecks});
        } else if (target.id.includes("quantity")) {
            const itemToUpdate = props.checks[index];
            console.log(itemToUpdate, value);
            const updatedChecksObjs = (prevChecksObjs) => {
                const newChecksObjs = {
                    ...prevChecksObjs,
                    [name]: {quantity:value, unit_of_measure:prevChecksObjs[name].unit_of_measure}
                }
                return newChecksObjs;
            }
            setChecksObjs(prevCheckboxes => updatedChecksObjs(prevCheckboxes))
        } else if (target.id.includes("unit")) {
            const itemToUpdate = props.checks[index];
            console.log(itemToUpdate, value);
            const updatedChecksObjs = (prevChecksObjs) => {
                const newChecksObjs = {
                    ...prevChecksObjs,
                    [name]: {quantity:prevChecksObjs[name].quantity, unit_of_measure:value}
                }
                return newChecksObjs;
            }
            setChecksObjs(prevCheckboxes => updatedChecksObjs(prevCheckboxes))
        } else {
            setNewItemValue(value)
        }
    }

    function makeListOfCheckboxElements (arr) {
        if (props.listType === 'materials') {
            return (
                arr.map((listItem, i)=>{
                    //add checked="checked" attribute to the input, make the onChange effect the db
                    return (
                        <div key={props.listType + i} className="row valign-wrapper">
                            <div className="col s5 left-align">
                                <label className="left-align">
                                    <input
                                        type="checkbox"
                                        name={listItem.text_value}
                                        checked={checkboxes[listItem.text_value]}
                                        onChange={(e)=>handleInputChange(e)}
                                        className="filled-in"
                                    />
                                    <span>{listItem.text_value}</span>
                                </label>
                            </div>
                            <div className="col s3">
                                <div className="input-field no-margin no-padding">
                                    <input id={"quantity"+i} type="number"
                                        className="validate no-margin no-padding"
                                        value={listItem.quantity}
                                        placeholder="Need"
                                        onChange={(e)=>handleInputChange(e,i)}
                                        />
                                </div>
                            </div>
                            <div className="col s4">
                                <div className="input-field no-margin no-padding">
                                    <input id={"unit"+i} type="text"
                                        className="validate no-margin no-padding"
                                        placeholder="Unit"
                                        value={listItem.unit_of_measure}
                                        onChange={(e)=>handleInputChange(e,i)}/>
                                </div>
                            </div>
                        </div>
                    )
                })
            )
        } else if (props.listType === "tools") {
            return(
                arr.map((listItem,i) => {
                    return (
                        <div key={props.listType + i} className="row valign-wrapper">
                            <div className="col s12 left-align">
                                <label className="left-align active">
                                    <input type="checkbox"
                                        className="filled-in"
                                        name={listItem.text_value}
                                        checked={checkboxes[listItem.text_value]}
                                        onChange={(e)=>handleInputChange(e)}/>
                                    <span>{listItem.text_value}</span>
                                </label>
                            </div>
                        </div>
                    )
                })
            )
        }
    }

    //Make the part of the props.addNewItem
    function addNewChecklistItem () {
        const newChecks = [].concat(props.checks);
        if (newItemValue.trim().length > 0) {
            const newCheck = {
                text_value:newItemValue,
                //is_complete:
            }
            newChecks.push(newCheck);
            console.log(newChecks)
            props.updateChecklist(props.checklistIndex, "addItem", [newCheck])
            setNewItemValue("");
        }
    }
    return (
            <div className="col s6">
                <div className="section blue-grey darken-4 blue-grey-text text-lighten-5">
                    <h5>{props.listTitle}</h5>
                    {checkboxElements}
                    <div>
                        <button id={"add-"+props.listType+"-btn-" + props.checklistIndex}
                                className="btn-floating btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button"
                                onClick={addNewChecklistItem}>
                                <i className="material-icons">add</i>
                        </button>
                        <div className="input-field inline blue-grey darken-4 blue-grey-text text-lighten-5">
                            <input id={"new-" + props.listType  + "-" + props.checklistIndex} type="text" className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                                value={newItemValue}
                                onChange={(e) => handleInputChange(e)}
                                onKeyDown={(e)=>{if(e.keyCode===13){addNewChecklistItem()}}}
                                placeholder={"Add New " + displayListType}/>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SimpleCheckboxSection;

/*
<span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
<label className="active" htmlFor={"quantity"+i}>Quan.</label>
<label className="active" htmlFor={"unit"+i}>Unit</label>
<label htmlFor={"new_" + props.listType}></label>
*/
