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
  // const [showFollow, setShowFollow] = useState( true);
  const [showFollow, setShowFollow] = useState( state ? !state.following.includes(userid) : true)
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
        //console.log(response);
        setUserProfile(response);
      }
      fetchData();
    } catch (error) {
      console.log({error});
    }
  }, [])

  //1.It fetches data from the server to update the user's following and followers lists.
  //2.It updates the global state using the dispatch function to ensure that other parts of your React application have access to this updated data.
  //3.It updates the local state of the component using setUserProfile with the functional update pattern. This is where the new follower is added to the user's followers list, preserving the previous state's structure.
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
      // Dispatch an action to UPDATE GLOBAL STATE
      dispatch({
        type: "UPDATE", payload: {
          following: response.following,
          followers: response.followers
        }
      });
      // UPDATE the 'USER' DATA in LOCAL STORAGE.
      localStorage.setItem('user', JSON.stringify(response));
      //passing state data in component tree
      //we return a new array with the previous items and what we have in the input from the user
      //functional update pattern, where the new state is calculated based on the previous state
      //this code effectively updates the component's state by creating a new state object.
      // UPDATE COMPONENT's state using the functional update pattern.
      setUserProfile(prevState => {
        return {
          ...prevState,//to CREATE A SHALLOW COPY of the previous state. This is a common practice in React to ensure that you're not modifying the previous state directly. Instead, you create a new object that inherits all the properties of the previous state.
          user: { //update user
            ...prevState.user, // CREATE A SHALLOW COPY of the previous user object.
            followers: [
              ...prevState.user.followers,// Create a new array with the previous followers.
              response._id// Add the new follower's ID to the array.
            ]
          }
        }
      })
      setShowFollow(false);
    } catch (error) {
      console.log(error);
    }
  }

  const unFollowUser = async () => {
    try {
      const request = await fetch('/unfollow', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          unfollowid: userid
        })
      });
      const response = await request.json();
      //UPDATE GLOBAL STATE
      dispatch({
        type: "UPDATE", payload: {
          following: response.following,
          followers: response.followers
        }
      })
      //UPDATE LOCAL STORAGE
      localStorage.setItem('user', JSON.stringify(response));
      //UPDATE COMPONENT STATE
      //previous state of the component. It represents the state of the component before the update. 
      setUserProfile(prevState => {
        const newFollowers = prevState.user.followers.filter(item => item !== response._id);
        //returns TRUE if != if == returns FALSE
        //returns all the ids that dont match the response, the response id is filtered 
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollowers
          }
        }
      })
      setShowFollow(true);
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
                  alt="title" src={userProfile ? userProfile.user.photo : "/broken-image.jpg"} />
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