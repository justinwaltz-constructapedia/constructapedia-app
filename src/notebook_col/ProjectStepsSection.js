import React from 'react';

function ProjectStepsSection (props) {
    const projectSteps = props.projectDraft.project_steps
    const projectStepDivs = projectSteps.map((step, index) => {
        return (
            <div>
                <p key={index}><b>{step.title}</b></p>
                {step.contents.map((content, index) => {
                    return <p key={index}>{content}</p>
                })}
            </div>
        )
    })

    return (
        <div className="col s6">
            <div className="section">
                <h5>Project Steps</h5>
                {projectStepDivs}
            </div>
        </div>
    )
}

export default ProjectStepsSection;
