/*
import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";

function AddSectionModal (props) {
    const addModalSelect = useRef(null);
    const addModalChecksSelect = useRef(null);
    const [addModalValue, setAddModalValue] = useState("");
    const [addModalSelectValue, setAddModalSelectValue] = useState("");
    const [addModalCheckTypeValue, setAddModalCheckTypeValue] = useState("tools");

    useEffect(() => {
        M.FormSelect.init(addModalSelect.current);
    })

    return (
        <div ref={addModal} id={"add-modal"+props.userPlans[props.selectedPlanIndex].title} className="modal">
            <div className="modal-content">
                <h4>{addModalTitle}</h4>
                <div className="input-field">
                    <input type="text" placeholder="Title"
                            id={"add-modal-title-input"}
                            className="validate"
                            value={addModalValue}
                            onChange={(e) => handleChange(e)}/>
                </div>
                <div className="row">
                    {
                        addModalType === "checklist" &&
                        <div className="input-field col s6">
                            <select id="add-modal-checks-select" ref={addModalChecksSelect} value={addModalCheckTypeValue} onChange={handleChange}>
                                <option value="tools">Tools</option>
                                <option value="materials">Materials</option>
                            </select>
                            <label>Checklist Type</label>
                        </div>
                    }
                    <div className="input-field col s6">
                        <select id="add-modal-select" ref={addModalSelect} value={addModalSelectValue} onChange={handleChange}>
                            <option value={props.userPlans[props.selectedPlanIndex].id}>Plan Overview</option>
                            {
                                props.userPlans[props.selectedPlanIndex].sub_plans.map((subPlan, i) => {
                                    return <option key={subPlan.title + i} value={subPlan.id}>{subPlan.title}</option>
                                })
                            }
                        </select>
                        <label>Add to...</label>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <a id="addModal-add-btn"
                    href="#projectDetails"
                    className="modal-close waves-effect waves-blue btn-flat"
                    onClick={addNewSection}>
                    Add
                </a>
            </div>
        </div>
    )
}
*/
