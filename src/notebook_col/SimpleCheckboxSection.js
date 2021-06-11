import React, {useState, useEffect} from 'react';

function SimpleCheckboxSection (props) {
    const [newItemValue, setNewItemValue] = useState("");
    const [checkboxes, setCheckboxes] = useState([]);
    const checkboxElements = makeListOfCheckboxElements(props.userPlans[props.selectedPlanIndex].checks);
    const displayListType = props.listType.trim().replace(/^\w/, (c) => c.toUpperCase());

    useEffect(() => {
        const checkboxesToSet = props.userPlans[props.selectedPlanIndex].checks
        setCheckboxes(checkboxesToSet.reduce(
            (options, option) => ({
                ...options,
                [option.text_value]:option.is_complete
            }),
            {}
        ))
    }, [props.userPlans, props.selectedPlanIndex]);
    function handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        if (target.type === 'checkbox'){
            const { name } = target;
            console.log(name);
            const updatedChecks = (prevCheckboxes) => {
                console.log(prevCheckboxes)
                const newChecks = {
                    ...prevCheckboxes,
                    [name]: !prevCheckboxes[name]
                }
                return newChecks
            }
            setCheckboxes(prevCheckboxes => updatedChecks(prevCheckboxes))
            const currentPlanChecks = props.userPlans[props.selectedPlanIndex].checks
            const newChecks = [];
            for (var i = 0; i < currentPlanChecks.length; i++) {
                newChecks[i] = currentPlanChecks[i]

            }
            const checkedAttribute = target.checked;
            const indexOfCheckToChange = currentPlanChecks.findIndex(check => check.text_value === target.name)
            console.log(newChecks,checkedAttribute,indexOfCheckToChange)
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            console.log(newChecks)
            props.savePlanChanges(props.userPlans[props.selectedPlanIndex].id, {checks:newChecks});
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
                                                value={props.userPlans[props.selectedPlanIndex].checks[i]}
                                                />
                                            <label htmlFor={"quantity"+i}>Need</label>
                                        </div>
                                    </div>
                                    <div className="col s4">
                                        <div className="input-field no-margin no-padding">
                                            <input id={"unit"+i} type="text" className="validate no-margin no-padding"/>
                                            <label htmlFor={"unit"+i}>Unit</label>
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
                                        <label className="left-align">
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
