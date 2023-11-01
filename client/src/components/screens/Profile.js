import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../App';

const Profile = () => {
  const [myposts, setMyposts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  console.log(state)
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
        console.log(response)
        setMyposts(response.myposts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [state])


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
            <span>{ state ? state.name : "loading..."}</span>
            <button>Edit Profile</button>
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