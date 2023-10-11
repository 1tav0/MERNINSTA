import React, { useEffect, useState } from 'react';
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const Navigate = useNavigate()
  //when url has been set successfully then we can create a post request
  useEffect(() => {
    if (url) { //mounts everytime we refresh w/out this and must log in 
      async function fetchData() {
        try {
          const request = await fetch('/createpost', {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
              title,
              body,
              photo: url
            })
          });
  
          const response = await request.json();
          if (response.error) {
            M.toast({html: response.error, classes: ""})
          } else {
            M.toast({ html: response.message, classes: "" });
            Navigate('/');
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [url])


  const postDetails = async () => {
    try {
      const data = new FormData()
      data.append("file", image);
      data.append("upload_preset", "MERNINSTA")
      data.append("cloud_name", "dcwdnswai")
      const request = await fetch("https://api.cloudinary.com/v1_1/dcwdnswai/image/upload", {
        method: "post",
        body: data
      });

      const response = request.json();
      //console.log(response);
      setUrl(response.url);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='card input-field wrapper'>
      <input
        type='text'
        placeholder='title'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='body'
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #1e88e5 blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="btn waves-effect waves-light #1e88e5 blue darken-1 submit__button"
        onClick={()=>postDetails()}
      >
        SubmitPost
      </button>
    </div>
  )
}

export default CreatePost