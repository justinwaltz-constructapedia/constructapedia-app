import React, {useState, useEffect} from 'react';

function SimpleCheckboxSection (props) {
    const [newItemValue, setNewItemValue] = useState("");
    const [checkboxes, setCheckboxes] = useState([]);
    const [checksObjs, setChecksObjs] = useState([]);
    const checkboxElements = makeListOfCheckboxElements(props.userPlans[props.selectedPlanIndex].checks);
    const displayListType = props.listType.trim().replace(/^\w/, (c) => c.toUpperCase());

    useEffect(() => {
        const checksToSet = props.userPlans[props.selectedPlanIndex].checks
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
        console.log(checksObjs);
    }, [props.userPlans, props.selectedPlanIndex, checksObjs]);

    function handleInputChange(event, index) {
        const target = event.target;
        const value = target.value;
        const currentPlan = props.userPlans[props.selectedPlanIndex];
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
            const currentPlanChecks = currentPlan.checks
            const newChecks = [];
            for (var i = 0; i < currentPlanChecks.length; i++) {
                newChecks[i] = currentPlanChecks[i]
            }
            const checkedAttribute = target.checked;
            //could be simplified with index parameter now
            const indexOfCheckToChange = currentPlanChecks.findIndex(check => check.text_value === target.name)
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            props.savePlanChanges(currentPlan.id, {checks:newChecks});
        } else if (target.id.includes("quantity")) {
            const itemToUpdate = currentPlan.checks[index];
            console.log(itemToUpdate, value);
            const updatedChecksObjs = (prevChecksObjs) => {
                const newChecksObjs = {
                    ...prevChecksObjs,
                    [name]: {quantity:value, unit_of_measure:prevChecksObjs[name].unit_of_measure}
                }
                return newChecksObjs
            }
            setChecksObjs(prevCheckboxes => updatedChecksObjs(prevCheckboxes))
        } else if (target.id.includes("unit")) {
            const itemToUpdate = currentPlan.checks[index];
            console.log(itemToUpdate, value);
            const updatedChecksObjs = (prevChecksObjs) => {
                const newChecksObjs = {
                    ...prevChecksObjs,
                    [name]: {quantity:prevChecksObjs[name].quantity, unit_of_measure:value}
                }
                return newChecksObjs
            }
            setChecksObjs(prevCheckboxes => updatedChecksObjs(prevCheckboxes))
        } else {
            setNewItemValue(value)
        }
    }

    function makeListOfCheckboxElements (arr) {
        if (props.listType === 'materials') {
            return (
                <div>
                    {arr.map((listItem, i)=>{
                        //add checked="checked" attribute to the input, make the onChange effect the db
                        if (listItem.item_type===props.listType) {
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
                                                onChange={(e)=>handleInputChange(e,i)}
                                                />
                                            <label className="active" htmlFor={"quantity"+i}>Quan.</label>
                                        </div>
                                    </div>
                                    <div className="col s4">
                                        <div className="input-field no-margin no-padding">
                                            <input id={"unit"+i} type="text"
                                                className="validate no-margin no-padding"
                                                value={listItem.unit_of_measure}
                                                onChange={(e)=>handleInputChange(e,i)}/>
                                            <label className="active" htmlFor={"unit"+i}>Unit</label>
                                        </div>
                                    </div>
                                </div>
                            )
                        }else{
                            return null;
                        }

                    })}
                </div>
            )
        } else if (props.listType === "tools") {
            return(
                <div>
                    {arr.map((listItem,i) => {
                        if (listItem.item_type===props.listType) {
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
                        } else {
                            return null;
                        }
                    })}
                </div>
            )
        }
    }

    //Make the part of the props.addNewItem
    function addNewChecklistItem () {
        const newPlanDraft = props.userPlans[props.selectedPlanIndex];
        if (newItemValue.trim().length > 0) {
            const newCheck = {
                text_value:newItemValue,
                //is_complete:
                item_type:props.listType
            }
            newPlanDraft.checks.push(newCheck);
            console.log(newPlanDraft)
            props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id,{checks:newPlanDraft.checks})
            console.log(newPlanDraft)
            setNewItemValue("");
        }
    }
    return (
            <div className="col s6">
                <div className="section">
                    <h5>{displayListType}</h5>
                    {checkboxElements}
                    <div>
                        <button id={"add-"+props.listType+"-btn"} className="btn-floating btn-small waves-effect waves-light blue" type="button"
                                onClick={addNewChecklistItem}>
                                <i className="material-icons">add</i>
                        </button>
                        <div className="input-field inline">
                            <input id={"new_" + props.listType} type="text" className="validate"
                                value={newItemValue}
                                onChange={(e) => handleInputChange(e)}
                                onKeyDown={(e)=>{if(e.keyCode===13){addNewChecklistItem()}}}/>
                            <label htmlFor={"new_" + props.listType}>Add New {displayListType}</label>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SimpleCheckboxSection;

/*
<span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
 */
