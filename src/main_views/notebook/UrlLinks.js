import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '../../utility_components/SearchBar.js';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

import { youtubeSearch, getYoutubePlayerObj } from '../../api/searchApi.js';
function UrlLinks(props) {
    //State Hooks
    const [youtubeResults, setYoutubeResults] = useState([]);
    // const [videoUrlValue, setVideoUrlValue] = useState('');
    const [youtubePlayer, setYoutubePlayer] = useState(false);
    const [playerIframe, setPlayerIframe] = useState('');
    const videoTabs = useRef(null);

    useEffect(() => {
        M.Tabs.init(videoTabs);
    },[])
    // function addNewItem() {
    //     const planId = props.planId;
    //     const prevUrlLinks = props.videoUrls;
    //     console.log(videoUrlValue);
    //     if (videoUrlValue.trim().length > 0) {
    //         //Should props be mutated like this? NO
    //         prevUrlLinks.push(videoUrlValue);
    //         console.log(prevUrlLinks);
    //         props.savePlanChanges(planId, { video_urls: prevUrlLinks });
    //         setVideoUrlValue('');
    //     }
    // }
    function requestYoutubeSearch(userQuery) {
        youtubeSearch(userQuery).then((res) => {
            console.log(res);
            setYoutubeResults(res.items);
        });
    }
    function viewYoutubeVideo(videoId) {
        getYoutubePlayerObj(videoId).then((res) => {

            console.log('youtube response',res);
            console.log(res.items[0].player.embedHtml);
            //setPlayerIframe(res.items);
            //setYoutubePlayer(true);
        });
        setPlayerIframe(videoId);
        setYoutubePlayer(true);
    }
    const youtubeVideoDisplays = (arr) => {
        return arr.map((resultItem) => {
            return (
                <a
                    key={resultItem.id.videoId}
                    className='collection-item'
                    onClick={() => viewYoutubeVideo(resultItem.id.videoId)}
                >
                    <img
                        alt={resultItem.snippet.title}
                        src={resultItem.snippet.thumbnails.default.url}
                    />
                    <p className='col s8 truncate'>{resultItem.snippet.title}</p>
                </a>
            );
        });
    }

    return (
        <>
            <div className='row center'>
                <SearchBar
                    handleSearch={requestYoutubeSearch}
                    placeholder='Search YouTube'
                />
            </div>
            <div className='row'>
                {youtubePlayer && (
                    <div className='col s7 center'>
                        <div className='video-container'>
                            <iframe
                                title='video-player'
                                width='100%'
                                src={`//www.youtube.com/embed/${playerIframe}`}
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button className='btn waves-effect waves-light'>
                            Save to Project
                        </button>
                    </div>
                )}
                <div className='col s5 right'>
                    <div className='row'>
                        <div className='col s12'>
                            <ul ref={videoTabs} className="tabs">
                                <li className="tab col s6">
                                    <a href="#youtube_results">
                                        <b>Results</b>
                                    </a>
                                </li>
                                <li className="tab col s6">
                                    <a href="#sow_playlist">
                                        <b>Playlist</b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div id='youtube_results' className='collection col s12'>
                            {youtubeResults.length > 0 && youtubeVideoDisplays(youtubeResults)}
                        </div>
                        <div id='youtube_results' className='collection col s12'>
                            <p>playlist</p>
                            {/*youtubeResults.length > 0 && youtubeVideoDisplays(youtubeResults)*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UrlLinks;
