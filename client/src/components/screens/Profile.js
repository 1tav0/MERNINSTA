import React from 'react';
import './Profile.css';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
const Profile = () => {
  return (
    <div className='profile__wrapper'>
      <div className="profile__wrapper__child">
        <div className="profile__picture">
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="title" src="https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg" />
        </div>
        <div className="profile__rightside">
          <div className="profile__top">
            <span>tavo__username</span>
            <button>Edit Profile</button>
            <SettingsIcon />
          </div>
          <div className="profile__middle">
            <span>80 posts</span>
            <span>376 followers</span>
            <span>300 following</span>
          </div>
          <div className="profile__bottom">
            <span>tavo@gmail.com</span>
            <span>Software engineer</span>
            <span>www.octavio-cruz.com</span>
          </div>
        </div>
      </div>
      <div className="profile__gallery">
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
          <img className='item__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='photo' />
      </div>
    </div>
  )
}

export default Profile