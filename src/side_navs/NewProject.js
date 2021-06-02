import React, {useState} from 'react';
import SearchBar from '../utility_components/SearchBar.js'
import {getSearchResults} from '../api/searchApi.js';
import {postPlan, getPlan} from '../api/projectsApi.js';

function NewProject(props){
    const [planTitleValue, setPlanTitleValue] = useState('');
    const [planGoalValue, setPlanGoalValue] = useState('');
    const [isSubstepsOn, setIsSubStepsOn] = useState(true)

    function createBlankPlan () {
        if (planTitleValue.trim().length > 0) {
            //add isSubstepsOn

            postPlan({title:planTitleValue, goal:planGoalValue, is_substeps_on:isSubstepsOn}).then((res) => {
                getPlan(res.id).then((createdPlan) => {
                    props.addUserPlan(createdPlan);
                    props.changeView('projects');
                })
                .catch(err => console.log(err));
            })

            //update plan draft
        }else{
            alert("needs title value");
        }
    }
    function searchForPlans(userInput) {
        createBlankPlan();
        getSearchResults(userInput).then((res) => {
            props.updateSearchResults(res);
            props.handleMainAppView('SearchResults');
        })
    }

    return(
        <div>

            <div className="row">
                <button type="button" className="waves-effect waves-blue btn-flat" onClick={()=>{props.changeView('projects')}}><i className="material-icons left">arrow_back</i>Back to Projects</button>
            </div>
            <div className="row">
                <h5 className="center-align">Start A New Project</h5>
                <div className="input-field col s12">
                    <input id="new_title_input" type="text" value={planTitleValue} onChange={(e)=> setPlanTitleValue(e.target.value)} />
                    <label htmlFor="new_title_input">Project Title</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <textarea placeholder="(Optional)" id="textarea1" className="materialize-textarea" onChange={(e)=> setPlanGoalValue(e.target.value)}></textarea>
                    <label htmlFor="textarea1" className="active">Project Goal</label>
                </div>
            </div>
            <div className="row">
                <div className="container">
                    <p>Will your project have substeps or just a single list of actions? (You can change this later)</p>
                </div>
                <div className="switch center-align">
                    {
                        //Add substeps to DB and settings button to plan list to change or delete settings info
                    }
                    <label>
                        Actions
                        <input disabled checked type="checkbox"  onChange={(e)=> setIsSubStepsOn(e.target.value)} />
                        <span className="lever"></span>
                        Substeps
                    </label>
                </div>
            </div>
            <div className="divider"></div>
            <div className="section"></div>
            <div className="section center-align">
                <button onClick={createBlankPlan} className="btn-small waves-effect waves-light blue" type="button">Create Blank Project<i className="material-icons right">arrow_forward</i></button>
            </div>
            <h6 className="center-align">OR</h6>
            <div className="row">
                <SearchBar handleSearch={searchForPlans}/>
            </div>
        </div>
    )
}

export default NewProject;
