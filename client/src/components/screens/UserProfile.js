import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  console.log(userid)
  useEffect(() => {
    try {
      async function fetchData() {
        const request = await fetch(`/user/${userid}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const response = await request.json();
        console.log(response);
        setUserProfile(response);
      }
      fetchData();
    } catch (error) {
      console.log({error});
    }
  }, [])


  return (
    <>
      {
        userProfile
          ?
          <div className='profile__wrapper'>
            <div className="profile__wrapper__child">
              <div className="profile__picture">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  alt="title" src="https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg" />
              </div>
              <div className="profile__rightside">
                <div className="profile__top">
                  <span>{ userProfile.user ? userProfile.user.name : "loading"}</span>
                  <button>Edit Profile</button>
                  <SettingsIcon />
                </div>
                <div className="profile__middle">
                  <span>{userProfile && userProfile.posts.length} posts</span>
                  <span>376 followers</span>
                  <span>300 following</span>
                </div>
                <div className="profile__bottom">
                  <span>{ userProfile.user ? userProfile.user.email : "loading..."}</span>
                  <span>Software engineer</span>
                  <span>www.octavio-cruz.com</span>
                </div>
              </div>
            </div>
            <div className="profile__gallery">
              {
                userProfile && userProfile.posts.map(post => {
                  return (
                    <img className='item__img' src={post.photo} alt={post.title} key={ post._id } />
                  )
                })
              }
            </div>
          </div>
          :
          <h2>
            "loading..."
          </h2>
      }
    </>
  )
}

export default Profile