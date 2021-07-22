import React, { useState } from 'react';

function UrlLinks(props) {
  const [videoUrlValue, setVideoUrlValue] = useState('');

  function addNewItem() {
    const planId = props.planId;
    const prevUrlLinks = props.videoUrls;
    console.log(videoUrlValue);
    if (videoUrlValue.trim().length > 0) {
      //Should props be mutated like this? NO
      prevUrlLinks.push(videoUrlValue);
      console.log(prevUrlLinks);
      props.savePlanChanges(planId, { video_urls: prevUrlLinks });
      setVideoUrlValue('');
    }
  }

  return (
    <li className='collection-item'>
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
    </li>
  );
}

export default UrlLinks;
