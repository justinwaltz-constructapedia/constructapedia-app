import React, {useState, useEffect, useRef} from 'react';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import BottomModalContent from '../modals/BottomModalContent.js'
import SearchBar from '../utility_components/SearchBar.js';
import {getSearchResults, postSelectionToScrape, googleSearch} from '../api/searchApi.js';

function SearchResults(props) {
    const results = props.results;
    const modal = useRef(null);
    const [urlToView, setUrlToView] = useState("");
    const [urlToViewHeading, setUrlToViewHeading] = useState("");

    const resultsList = results.map((result, index) => {
        return <ResultListItem key={index} title={result.title} image={result.pagemap.cse_image[0].src} link={result.link} updateUrlToView={updateUrlToView} updateProjectDraft={props.updateProjectDraft}/>
    })

    useEffect(()=>{
        const options = {
            dismissible: false
        }
        M.Modal.init(modal.current, options);
    }, [])

    function updateUrlToView (url, heading) {
        setUrlToView(url);
        setUrlToViewHeading(heading)
        console.log(modal.current)
        const instance = M.Modal.getInstance(modal.current);
        console.log(instance)
        instance.open()
    }
    function searchForProjects(userInput) {
        /*
        getSearchResults(userInput).then((res) => {
            props.updateSearchResults(res);
        })
        */
        googleSearch(userInput).then((res) => {
            console.log(res);
            props.updateSearchResults(res.items);
        })
    }

    return (
        <div className="col s12">
            <div className="app-column">
                <div className = "row">
                    <button type="button" className="waves-effect waves-blue btn-flat blue-grey darken-4 blue-grey-text text-lighten-5 " onClick={()=>{props.handleMainAppView('ProjectDetails')}}><i className="material-icons left blue-grey-text text-lighten-5">arrow_back</i>Back to Project</button>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div ref={modal} id="search-modal" className="modal bottom-sheet blue-grey darken-4 blue-grey-text text-lighten-5">
                            <BottomModalContent modalType="search" heading={urlToViewHeading} urlToView={urlToView}/>
                        </div>
                        <SearchBar handleSearch={searchForProjects}/>
                        <div className="container">
                            <div className="row">
                                {resultsList}
                            </div>
                            <ul className="pagination">
                                <li className="disabled"><a href="#prevpage"><i class="material-icons">chevron_left</i></a></li>
                                <li className="active"><a href="#1">1</a></li>
                                <li className="waves-effect"><a href="#2">2</a></li>
                                <li className="waves-effect"><a href="#3">3</a></li>
                                <li className="waves-effect"><a href="#4">4</a></li>
                                <li className="waves-effect"><a href="#5">5</a></li>
                                <li className="waves-effect"><a href="#nextpage"><i class="material-icons">chevron_right</i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function ResultListItem(props) {
    function scrapePage (url){
        const selectionEndpoint = url.replace('https://google.com/',"");
        postSelectionToScrape(selectionEndpoint).then((res) => {
            props.updateProjectDraft(res);
        });
    }
    return(
            <div className="col s12 m6 l4 blue-grey darken-4 blue-grey-text text-lighten-5">
                <div className="card medium hoverable blue-grey darken-4 blue-grey-text text-lighten-5">
                    <div className="card-image">
                        <img src={props.image} alt="Result" />
                        <span className="card-title"></span>
                    </div>
                    <div className="card-content">
                        <p>{props.title}</p>
                    </div>
                    <div className="card-action">
                        <button className="waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5 btn" onClick={()=>props.updateUrlToView(props.link, props.title)}>View Page</button>
                        <button className="waves-effect waves-light blue-grey darken-4 blue-grey-text text-lighten-5 btn" onClick={()=>scrapePage(props.link)}>Auto Import</button>
                    </div>
                </div>
            </div>
    )
}

export default SearchResults;
