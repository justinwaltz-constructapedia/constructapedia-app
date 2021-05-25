import React from 'react';

function UserProjects(props) {
    const projects = props.userProjects;

    const projectsList = projects.map((project) => {
            return (
                <li key={project.id} className="bold">
                    <div className="collapsible-header">
                        <h6 className="valign-wrapper" onClick={()=>selectProject(project.id)}>{project.title} <i className="material-icons">chevron_right</i></h6>
                    </div>
                    <div className="collapsible-body">
                        <ul>
                            <li>Major Project Steps</li>
                        </ul>
                    </div>
                </li>
            )
    })
    function selectProject(id){
        const selectedProject = projects.find(project => project.id === id);
        console.log(selectedProject)
        props.changeToNewProject(selectedProject);
        props.handleMainAppView('ProjectDetails');
    }
    return (
        <div className="row">
            <div className="col s12">
                <div className="row center-align">
                    <h5>{props.name}'s Projects</h5>
                    <button className="btn waves-effect waves-light blue" onClick={()=>{props.changeView('search')}}><i className="material-icons left">add</i>New Project</button>
                </div>
                <ul className="collapsible collapsible-accordion">
                    {projectsList}
                </ul>
            </div>
        </div>
    )
}

export default UserProjects;
