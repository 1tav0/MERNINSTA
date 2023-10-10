import React from 'react';
import './CreatePost.css';

const CreatePost = () => {
  return (
    <div className='card input-field wrapper'>
      <input type='text' placeholder='title' />
      <input type='text' placeholder='body' />
      <div className="file-field input-field">
        <div className="btn #1e88e5 blue darken-1">
          <span>Upload Image</span>
          <input type="file" />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="btn waves-effect waves-light #1e88e5 blue darken-1 submit__button">
        SubmitPost
      </button>
    </div>
  )
}

export default CreatePost