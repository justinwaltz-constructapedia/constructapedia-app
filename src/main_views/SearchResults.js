//Import React and hooks used
import React, {useState, useEffect, useRef} from 'react';
//Import Materialize functionality
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
//Import Project Components
import BottomModalContent from '../modals/BottomModalContent.js'
import SearchBar from '../utility_components/SearchBar.js';
//Import Functions
import {googleSearch} from '../api/searchApi.js';
import {scrapper} from '../api/scrapper.js';

//Functional Component
    //Handles the view for using and displaying the programmatic google search api
function SearchResults(props) {
//Ref hooks
    //Materialize functionality
    const modal = useRef(null);
//State Hooks
    const [urlToView, setUrlToView] = useState("");
    const [urlToViewHeading, setUrlToViewHeading] = useState("");
    const [results, setResults] = useState([]);
//Effect Hooks
    //Intitialzes Materialize side nav and collapsible
    useEffect(()=>{
        const options = {
            dismissible: false
        }
        M.Modal.init(modal.current, options);
    }, [])
//Component functionality
    //sets the embeded viewer url
    //NOTE: Needs to be updated to just open in new tab
    function updateUrlToView (url, heading) {
        setUrlToView(url);
        setUrlToViewHeading(heading)
        console.log(modal.current)
        const instance = M.Modal.getInstance(modal.current);
        console.log(instance)
        instance.open()
    }
    //Passes user query to the function for google search api
    function searchForProjects(userInput) {
        googleSearch(userInput).then((res) => {
            console.log(res);
            //Populates the results list for display
            setResults(res.items);
        })
    }
    //Maps out the display for each google result in the results array
    const resultsList = results.map((result, index) => {
        if (results.length > 0) {
            return <ResultListItem
                        key={index}
                        title={result.title}
                        image={result.pagemap.cse_image[0].src}
                        link={result.link}
                        updateUrlToView={updateUrlToView}
                        updateProjectDraft={props.updateProjectDraft}
                        addUserPlan={props.addUserPlan}
                    />;
        } else {
            return null;
        }
    })
//Return view of this component:
//Includes Search Bar, Results and bottom modal for viewing embedded webpage
    return (
        <div className="col s12">
            <div className="app-column">
                { props.mainAppView === "SearchResults" &&
                    <div className = "row">
                        <button type="button" className="waves-effect waves-blue btn-flat blue-grey darken-4 blue-grey-text text-lighten-5 " onClick={()=>{props.handleMainAppView('ProjectDetails')}}><i className="material-icons left blue-grey-text text-lighten-5">arrow_back</i>Back to Project</button>
                    </div>
                }
                <div className="row">
                    <div className="col s12">
                        {props.mainAppView === "SearchResults" && <SearchBar handleSearch={searchForProjects}/>}
                        <div className="container">
                            <div className="row">
                                {resultsList}
                            </div>
                            <ul className="pagination">
                                <li className="disabled"><a href="#prevpage"><i className="material-icons">chevron_left</i></a></li>
                                <li className="active"><a href="#1">1</a></li>
                                <li className="waves-effect"><a href="#2">2</a></li>
                                <li className="waves-effect"><a href="#3">3</a></li>
                                <li className="waves-effect"><a href="#4">4</a></li>
                                <li className="waves-effect"><a href="#5">5</a></li>
                                <li className="waves-effect"><a href="#nextpage"><i className="material-icons">chevron_right</i></a></li>
                            </ul>
                        </div>
                        <div ref={modal} id="search-modal" className="modal bottom-sheet blue-grey darken-4 blue-grey-text text-lighten-5">
                            <BottomModalContent modalType="search" heading={urlToViewHeading} urlToView={urlToView}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

//Handles the view for each indivdual result from google programatic search stored in the results array
function ResultListItem(props) {
//Component functionality
    //Sends request to scrape selected pag from result and adds a new plan to user account
    //NOTE: Needs to handle adding to existing plan if SearchResults was rendered from PlanDetails
    async function scrapePage (url){
        const scrapedData = await scrapper(url);
        props.addUserPlan({
            title: scrapedData.title,
            checks: [
                {
                    title:"Imported Materials",
                    list_type: "materials",
                    list: scrapedData.Materials.reduce((materials, material) => {
                        materials.push({text_value:material})
                        return materials;
                    },[])
                }
            ]
        })
    }
//Return view of this component:
    //Includes result info display, view and scraping button functionality
    //Display changes depending on whether it was rendered from NewProject or AppBody(via ProjectDetails)
    return(
        <div className="col s12 m6 l4">
            <div className="card medium hoverable">
                <div className="card-image">
                    <img src={props.image} alt="Result" />
                    <span className="card-title"></span>
                </div>
                <div className="card-content">
                    <p>{props.title}</p>
                </div>
                <div className="card-action">
                    <button
                        className="waves-effect waves-light btn indigo"
                        onClick={()=>props.updateUrlToView(props.link, props.title)}
                    >
                        View Page
                    </button>
                    <button
                        className="waves-effect waves-light btn indigo"
                        onClick={()=>scrapePage(props.link)}
                    >
                        {(props.mainAppView === "SearchResults")?'Auto Import':'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchResults;
// const selectionEndpoint = url.replace('https://google.com/',"");
// postSelectionToScrape(selectionEndpoint).then((res) => {
//     props.updateProjectDraft(res);
// });
