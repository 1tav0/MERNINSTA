import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const [follow, setFollow] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
  // console.log(state)
  useEffect(() => {
    try {
      async function fetchData() {
        const request = await fetch(`/user/${userid}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const response = await request.json();
        // console.log(response);
        setUserProfile(response);
      }
      fetchData();
    } catch (error) {
      console.log({error});
    }
  }, [])

  useEffect(() => {
    setShowFollow(state && !state.following.includes(userid));
  },[state, userid])

  const followUser = async () => {
    try {
      const request = await fetch('/follow', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          followid: userid
        })
      });
      const response = await request.json();
      // Check if user is already following the person they are trying to follow If the user is not already following the person they are trying to follow, we update the local state accordingly. If the user is already following the person, we do not update the local state. This should prevent the user from following the same person multiple times.
      // console.log(response);
      dispatch({ type: "UPDATE", payload: { following: response.following, followers: response.followers } });
      localStorage.setItem('user', JSON.stringify(response));
      //functional update pattern, where the new state is calculated based on the previous state 
      //this code effectively updates the component's state by creating a new state object.
      setUserProfile(prevState => {
        return {
          ...prevState,//to create a shallow copy of the previous state. This is a common practice in React to ensure that you're not modifying the previous state directly. Instead, you create a new object that inherits all the properties of the previous state.
          user: {
            ...prevState.user,
            followers: [
              ...prevState.user.followers,
              response._id
            ]
          }
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const unFollowUser = async () => {
    try {
      const request = fetch('/unfollow', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          unfollowid: userid
        })
      })
    } catch (error) {
      console.log(error);
    }
  }

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
                  <span> {userProfile && userProfile.user.followers.length } followers</span>
                  <span>{userProfile && userProfile.user.following.length } following</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap:"10px"
                  }}
                >
                  {
                    showFollow
                      ?
                      <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
                        onClick={() => followUser()}
                        style={{
                          width: "48%",
                        }}
                      >
                        follow
                      </button>
                      :
                      <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
                        onClick={() => unFollowUser()}
                        style={{
                          width:"auto"
                        }}
                      >
                    unfollow
                  </button>
                  }
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