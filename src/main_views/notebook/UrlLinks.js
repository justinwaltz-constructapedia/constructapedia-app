import React, { useState } from 'react';
import SearchBar from '../../utility_components/SearchBar.js';
import {youtubeSearch, getYoutubePlayerObj} from '../../api/searchApi.js'
function UrlLinks(props) {
//State Hooks
    const [youtubeResults, setYoutubeResults] = useState([])
    // const [videoUrlValue, setVideoUrlValue] = useState('');
    const [youtubePlayer, setYoutubePlayer] = useState(false);
    const [playerIframe, setPlayerIframe] = useState('');
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
    function requestYoutubeSearch (userQuery) {
        youtubeSearch(userQuery).then((res) => {
            console.log(res);
            setYoutubeResults(res.items);
        })
    }
    function viewYoutubeVideo(videoId) {
        getYoutubePlayerObj(videoId).then((res) => {
            console.log(JSON.parse(res));
            console.log(res.items[0].player.embedHtml);
            //setPlayerIframe(res.items);
            //setYoutubePlayer(true);
        })
        setPlayerIframe(videoId);
        setYoutubePlayer(true);
    }
    const youtubeResultDisplays = youtubeResults.map((resultItem) => {
        return (
            <li key={resultItem.id.videoId} className='collection-item'>
                <img alt={resultItem.snippet.title} src={resultItem.snippet.thumbnails.default.url}/>
                <p className='col s4'>{resultItem.snippet.title}</p>
                <button
                    className='btn-small waves-effect waves-light'
                    onClick={()=>viewYoutubeVideo(resultItem.id.videoId)}
                >
                    View
                </button>
            </li>
        )
    })

  return (
    <>
    {youtubePlayer && <div className="video-container"><iframe title="video-player" width="100%" src={`//www.youtube.com/embed/${playerIframe}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>}
    <ul className='collection with-header'>
        {youtubeResults.length > 0 && youtubeResultDisplays}
        <li className='collection-header'>
            <SearchBar
                handleSearch={requestYoutubeSearch}
                placeholder="Search YouTube"
            />
        </li>
    </ul>
    </>
  );
}

export default UrlLinks;
/*
<button
  id='add-video-btn'
  onClick={addNewItem}
  className='btn-floating waves-effect waves-light indigo'
  type='button'
>
  <i className='material-icons'>add</i>
</button>
<div className='input-field inline'>
    <input
        id='new_video'
        type='text'
        className='validate'
        value={videoUrlValue}
        placeholder='Video website address (URL)'
        onChange={(e) => setVideoUrlValue(e.target.value)}
    />
</div>
*/
