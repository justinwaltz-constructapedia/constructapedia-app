import React, {useState} from 'react';

function SimpleCheckboxSection (props) {
    const [newItemValue, setNewItemValue] = useState("");

    const checkboxElements = makeListOfCheckboxElements(props.planDraft.checks);
    const displayListType = props.listType.trim().replace(/^\w/, (c) => c.toUpperCase());

    function handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        if (target.type === 'checkbox'){
            const newChecks = props.userPlans.checks
            const checkedAttribute = target.checked;
            const indexOfCheckToChange = newChecks.findIndex(check => check.text_value === value)
            console.log(newChecks,checkedAttribute,indexOfCheckToChange)
            newChecks[indexOfCheckToChange].is_complete = checkedAttribute;
            console.log(newChecks)
            props.saveSpecificPlanChanges({checks:newChecks});
        } else {
            setNewItemValue(value)
        }
    }
    function makeListOfCheckboxElements (arr) {
        return (
            <div>
                {arr.map((listItem, i)=>{
                    //add checked="checked" attribute to the input, make the onChange effect the db
                    if (listItem.item_type===props.listType) {
                        return (
                            <div key={i} className="row valign-wrapper">
                                <div className="col s5 left-align">
                                    <label className="left-align">
                                        <input type="checkbox"
                                            value={listItem.text_value}
                                            className="filled-in"
                                            checked={listItem.is_complete}
                                            onChange={(e)=>handleInputChange(e)}/>
                                        <span>{listItem.text_value}</span>
                                    </label>
                                </div>
                                <div className="col s3">
                                    <div className="input-field no-margin no-padding">
                                        <input id={"quantity"+i} type="number" className="validate no-margin no-padding"/>
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
    }
    function addNewChecklistItem () {
        const newPlanDraft = props.planDraft;
        if (newItemValue.trim().length > 0) {
            const newCheck = {
                text_value:newItemValue,
                //is_complete:
                item_type:props.listType
            }
            newPlanDraft.checks.push(newCheck);
            props.saveSpecificPlanChanges({checks:newPlanDraft.checks})
            console.log(newPlanDraft)
            props.changeOrUpdatePlanDraft(newPlanDraft);
            setNewItemValue("");
        }
    }
    return (
            <div className="col s6">
                <div className="section">
                    <h5>{displayListType}</h5>
                    {checkboxElements}
                    <div>
                        <button id={"add-"+props.listType+"-btn"}
                            onClick={addNewChecklistItem} className="btn-floating btn-small waves-effect waves-light blue" type="button"><i className="material-icons">add</i></button>
                        <div className="input-field inline">
                            <input id={"new_" + props.listType} type="text" className="validate" value={newItemValue} onChange={(e) => handleInputChange(e)}/>
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
