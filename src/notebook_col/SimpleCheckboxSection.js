import React, {useState} from 'react';

function SimpleCheckboxSection (props) {
    const [newItemValue, setNewItemValue] = useState("");
    const checkboxElements = makeListOfCheckboxElements(props.projectDraft[props.listType]);
    const displayListType = props.listType.trim().replace(/^\w/, (c) => c.toUpperCase());

    function makeListOfCheckboxElements (arr) {
        return (
            <div>
                {arr.map((listItem, i)=>{
                    //add checked="checked" attribute to the input
                    return (
                        <p key={i}>
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>{listItem}</span>
                            </label>
                        </p>
                    )
                })}
            </div>
        )
    }
    function addNewItem () {
        const newProjectDraft = props.projectDraft;
        const listToUpdate = props.listType
        if (newItemValue.length > 0) {
            newProjectDraft[listToUpdate].push(newItemValue);
            console.log(newProjectDraft)
            props.updateProjectDraft(newProjectDraft);
            setNewItemValue("");
        }
    }
    return (
            <div className="col s6">
                <div className="section">
                    <h5>{displayListType}</h5>
                    {checkboxElements}
                    <div>
                        <button onClick={addNewItem} className="btn-floating btn-small waves-effect waves-light blue" type="button"><i className="material-icons">add</i></button>
                        <div className="input-field inline">
                            <input id={"new_" + props.listType} type="text" className="validate" value={newItemValue} onChange={(e) => setNewItemValue(e.target.value)}/>
                            <label htmlFor={"new_" + props.listType}>Add New {displayListType}</label>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SimpleCheckboxSection;
