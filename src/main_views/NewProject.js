import React, {useState} from 'react';
import SearchBar from '../utility_components/SearchBar.js'
import {getSearchResults} from '../api/searchApi.js';
//import {postPlan, getUserPlans} from '../api/projectsApi.js';

function NewProject(props){
    const [planTitleValue, setPlanTitleValue] = useState('');

    function createBlankPlan () {
        if (planTitleValue.trim().length > 0) {
            props.addUserPlan({title:planTitleValue})
            props.handleMainAppView('HomePage');
        }else{
            alert("needs title value");
        }
    }
    function searchForPlans(userInput) {
        if (planTitleValue.trim().length > 0 && userInput.trim().length > 0) {
            createBlankPlan();
            getSearchResults(userInput).then((res) => {
                props.updateSearchResults(res);
                props.handleMainAppView('SearchResults');
            })
        } else {
            alert("Enter a title and search term");
        }
    }

    return(
        <div>
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <button type="button" className="waves-effect waves-blue btn-flat blue-grey darken-4 blue-grey-text text-lighten-5 " onClick={()=>{props.handleMainAppView('HomePage')}}><i className="material-icons left">arrow_back</i></button>
            </div>
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <h5 className="center-align blue-grey darken-4 blue-grey-text text-lighten-5">Hold My Beer</h5>
                <div className="input-field col s12 blue-grey darken-4 blue-grey-text text-lighten-5" >
                    <input className="blue-grey darken-4 blue-grey-text text-lighten-5" id="new_title_input" type="text" value={planTitleValue} onChange={(e)=> setPlanTitleValue(e.target.value)} />
                    <label htmlFor="new_title_input">Project Title</label>
                </div>
            </div>
            <div className="section center-align blue-grey darken-4 blue-grey-text text-lighten-5">
                <button onClick={createBlankPlan} className="btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="button">Create A Project<i className="material-icons left">add</i></button>
            </div>
            <h6 className="center-align blue-grey darken-4 blue-grey-text text-lighten-5">OR</h6>
            <div/>
            <h5 className="center-align blue-grey darken-4 blue-grey-text text-lighten-5">Do a Little Research</h5>
            <div className="row blue-grey darken-4 blue-grey-text text-lighten-5">
                <SearchBar handleSearch={searchForPlans}/>
            </div>
        </div>
    )
}

export default NewProject;
/*
const [planGoalValue, setPlanGoalValue] = useState('');
const [isSubstepsOn, setIsSubStepsOn] = useState(true)

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
</div>*/
