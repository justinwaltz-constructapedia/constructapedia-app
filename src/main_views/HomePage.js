import React from 'react';

function HomePage(props){

    return (
        <div className="row">
            <div className="col s12">
                <ul id="home-page-nav" className="col s9 offset-s1 blue-grey darken-4 blue-grey-text text-lighten-5">
                    <li className="center-align blue-grey darken-4 blue-grey-text text-lighten-5">
                        <b>Construct-A-Network</b>
                    </li>
                    <li className="center-align blue-grey darken-4 blue-grey-text text-lighten-5">
                        <button className="btn waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5"
                                onClick={()=>{props.handleMainAppView('NewProject')}}>
                            <i className="material-icons left">add</i>
                            Create-A-Project
                        </button>
                    </li>
                    {props.userPlans.length > 0 &&
                        props.userPlans.map((plan) => {
                                return (
                                    <li key={plan.id} className="bold">
                                        <div className="blue-grey darken-4 blue-grey-text text-lighten-5">
                                            <a href="#notebook" className="waves-effect waves-light btn-flat white-text" onClick={()=>props.updateSelectedPlan(plan.id)}>
                                                <h6 className="valign-wrapper">
                                                    {plan.title}<i className="material-icons">chevron_right</i>
                                                </h6>
                                            </a>
                                            <button className="btn-flat center-align right waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5"
                                                    onClick={()=>{props.removeUserPlan(plan.id)}}>
                                                <i className="material-icons left blue-grey darken-4 blue-grey-text text-darken-2">delete_forever</i>
                                            </button>
                                        </div>
                                    </li>
                                )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
export default HomePage;

/*
const projectNav = useRef(null);
ref={projectNav}
className="sidenav sidenav-fixed z-depth-0
useEffect(() => {
    const projectNavOptions = {
        inDuration: 250,
        outDuration: 200,
        draggable: true
    };
    M.Sidenav.init(projectNav.current, projectNavOptions);
},[]);
<UserProjects
    userPlans={props.userPlans}
    selectedPlanIndex={props.selectedPlanIndex}
    changeView={changeView}
    handleMainAppView={props.handleMainAppView}
    updateSelectedPlan={props.updateSelectedPlan}
    updateUserPlans={props.updateUserPlans}
    removeUserPlan={props.removeUserPlan}
    savePlanChanges={props.savePlanChanges}/>
 */