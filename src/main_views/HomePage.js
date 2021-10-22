//Import React
import React, {useContext} from 'react';
//Import for useContext
import {PlanContext} from '../PlanContext.js'
//Import DB Api functions
import { getUserPlans, deletePlan } from '../api/projectsApi';
//Import Styles
import './HomePage.css';

//Functional Component
    //Handles view for the landing/homepage page of a signed in user
function HomePage(props) {
//Return view of this component:
    //Includes the list of user projects and functionalty assoc. with each
    //useContext hook
        const [contextState, contextDispatch] = useContext(PlanContext);
    //Deletes userplan from db, gets updated plan list then updates context state
    function deleteProject(planId) {
        console.log('deleting plan with id: ', planId);
        deletePlan(planId).then((res) => {
            console.log(res);
            //Update the list of projects
            getUserPlans().then((updatedPlans) => {
                contextDispatch({type:'field',field:'plans',payload:updatedPlans});
            });
        });
    }
    //Changes which of the user's plans are displayed
    function selectPlan(selectedPlanId) {
        contextDispatch({type:'selectSow', field:'project', payload:selectedPlanId});
        // contextDispatch({type:'field',field:'selectedSowId', payload:contextState.plans[selectedPlanIndex].id});
        // contextDispatch({type:'field',field:'selectedPlanIndex', payload:selectedPlanIndex});
        props.handleMainAppView('ProjectDetails')
    }
    return (
        <div className='row'>
            <div className='col s12'>
                <div className='section'>
                    <button
                        className='btn waves-effect waves-light indigo white-text'
                        onClick={() => {
                            props.handleMainAppView('NewProject');
                        }}
                    >
                        <b>&#123;C&#125; - Construct-A-Project</b>
                    </button>
                </div>
                <ul id='home-page-nav' className='collection with-header'>
                    <div>
                        <li className='collection-header center grey lighten-5 indigo-text text-darken-3'>
                            <b>Projects</b>
                        </li>
                    </div>
                    <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
                        <b>In Progress</b>
                    </li>
                    {contextState.plans.length > 0 &&
                        contextState.plans.map((plan, i) => {
                            return (
                                <li key={plan.id} className='collection-item'>
                                    <div className='indigo-text text-darken-3'>
                                        <a
                                            href='#notebook'
                                            className='waves-effect waves-light btn-flat indigo-text text-darken-3'
                                            onClick={() => selectPlan(plan.id)}
                                        >
                                            <h6 className='valign-wrapper'>
                                                {plan.title}
                                                <i className='material-icons'>chevron_right</i>
                                            </h6>
                                      </a>

                                        <button
                                            className='btn-flat center-align right waves-effect waves-light  hide-on-small-and-down '
                                            onClick={() => {
                                                deleteProject(plan.id);
                                            }}
                                        >
                                            <i className='material-icons grey-text text-lighten-4'>delete_forever</i>
                                        </button>
                                    </div>
                                </li>
                            );
                        })
                    }
                    <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
                        <b>Finished</b>
                    </li>
                    <li className='collection-item'>
                        Coming Soon <i className='material-icons'>share</i>
                    </li>
                </ul>
                <ul id='home-page-nav' className='collection with-header'>
                    <div>
                        <li className='collection-header center grey lighten-5 indigo-text text-darken-3'>
                            <b>Construct-A-Network</b>
                        </li>
                    </div>

                    <li className='collection-header indigo-text text-darken-3 indigo lighten-5'>
                        <b>
                            Coming Soon <i className='material-icons'>share</i>
                        </b>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default HomePage;
