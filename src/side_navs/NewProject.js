import React, {useState} from 'react';
import SearchBar from '../utility_components/SearchBar.js'
import {getSearchResults} from '../api/searchApi.js';

function NewProject(props){
    const [projectTitleValue, setProjectTitleValue] = useState('');

    function searchForProjects(userInput) {
        if (projectTitleValue.trim().length > 0) {
            props.createPlan({title:projectTitleValue});
        }
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
                <div className="input-field col s12">
                    <input id="new_title_input" type="text" value={projectTitleValue} onChange={(e)=> setProjectTitleValue(e.target.value)} />
                    <label htmlFor="new_title_input">Project Title</label>
                </div>
            </div>
            <div className="row">
                <SearchBar handleSearch={searchForProjects}/>
            </div>
        </div>
    )
}

export default NewProject;
