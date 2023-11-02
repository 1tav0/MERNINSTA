import React, { useContext, useEffect, useRef, useState } from 'react';
import './Profile.css';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../App';

const Profile = () => {
  const [myposts, setMyposts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  // console.log(state)
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  //This programmatically triggers a click event on the hidden file input element. This has the effect of opening the file selection dialog for the user, even though the input is hidden from view.
  const handleEditImageClick = () => {
    fileInputRef.current.click();// Trigger the file input click when the "Edit Image" button is clicked
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch('/myposts', {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const response = await request.json();
        // console.log(response)
        setMyposts(response.myposts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [state])

  useEffect(() => {
    if (image) {
      async function fetchData() {
        try {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "MERNINSTA")
          data.append("cloud_name", "dcwdnswai")
          const request = await fetch("https://api.cloudinary.com/v1_1/dcwdnswai/image/upload", {
            method: "post",
            body: data
          });
  
          const response = await request.json();
          //console.log(response);
          const fetchPic = await fetch("/updatepic", {
            method: "Put",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                photo: response.url
            })
          })
          const fetchPicResponse = await fetchPic.json();
          console.log(fetchPicResponse);
          localStorage.setItem('user', JSON.stringify({ ...state, photo: fetchPicResponse.photo }))
          dispatch({ type: "UPDATEPHOTO", payload: fetchPicResponse.photo })
        } catch (error) {
          console.log(error);
        }
        setIsUploading(false)
      }
      fetchData();
    }
  }, [image])

  const updatePhoto = (file) => {
    setImage(file);
    setIsUploading(true);
  }
  return (
    <div className='profile__wrapper'>
      <div className="profile__wrapper__child">
        <div className="profile__picture">
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="title" src={state?.photo || "/broken-image.jpg"} />
        </div>
        <div className="profile__rightside">
          <div className="profile__top">
            <span>{state ? state.name : "loading..."}</span>
              {
                isUploading 
                ? 
                (
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                            
                ) 
                : 
                (
                  <div className="btn #1e88e5 blue darken-1 custom__button" onClick={handleEditImageClick}>
                    <span>Edit Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{display: "none"}}
                      onChange={e => updatePhoto(e.target.files[0])}
                    />
                  </div>
                )
              }
            <SettingsIcon />
          </div>
          <div className="profile__middle">
            <span>{myposts.length} posts</span>
            <span>{state && state.followers.length} followers</span>
            <span>{state && state.following.length} following</span>
          </div>
          <div className="profile__bottom">
            <span>{state && state.email}</span>
            <span>Software engineer</span>
            <span>www.octavio-cruz.com</span>
          </div>
        </div>
      </div>
      <div className="profile__gallery">
        {
          myposts.map(mypost => {
            return (
              <img className='item__img' src={mypost.photo} alt={mypost.title} key={ mypost._id } />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile