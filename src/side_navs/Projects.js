import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import NewProject from './NewProject.js';
import UserProjects from './UserProjects.js';

function Projects(props){
    const [view, setView] = useState('projects');
    const projectNav = useRef(null);

    useEffect(() => {
        const projectNavOptions = {
            inDuration: 250,
            outDuration: 200,
            draggable: true
        };
        M.Sidenav.init(projectNav.current, projectNavOptions);
    },[]);

    function changeView(name){
        setView(name);
    }

    return (
        <ul id="project-nav" ref={projectNav} className="sidenav sidenav-fixed z-depth-0 blue-grey darken-4 blue-grey-text text-lighten-5">
            <li className="center-align blue-grey darken-4 blue-grey-text text-lighten-5"><b>Construct-A-Network</b></li>
            {view === 'projects'
                ? <UserProjects
                    name={props.user.name}
                    userPlans={props.userPlans}
                    changeView={changeView}
                    handleMainAppView={props.handleMainAppView}
                    updateSelectedPlan={props.updateSelectedPlan}
                    updateUserPlans={props.updateUserPlans}
                    removeUserPlan={props.removeUserPlan}/>
                : <NewProject
                    addUserPlan={props.addUserPlan}
                    changeView={changeView}
                    updateSearchResults={props.updateSearchResults}
                    updateUserPlans={props.updateUserPlans}
                    updateSelectedPlan={props.updateSelectedPlan}
                    handleMainAppView={props.handleMainAppView}/>
            }
        </ul>
    )
}
export default Projects;
