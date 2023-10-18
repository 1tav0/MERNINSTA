import React, { useContext, useEffect, useState } from 'react'
import './Home.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../../App'

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch("/allposts", {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const response = await request.json();
        // console.log(response)
        setPosts(response.posts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [state])


  const likePost = async (id) => {
    try {
      console.log(id)
      const request = await fetch("/like", {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      });

      const response = await request.json();
      console.log(response)
      const newLikesArray = posts.map(post => {
        if (post._id === response._id) {
          return response;
        } else {
          return post;
        }
      })

      setPosts(newLikesArray);
    } catch (error) {
      console.log(error);
    }
  }

  const unlikePost = async (id) => {
    try {
      const request = await fetch("/unlike", {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      });

      const response = await request.json();
      console.log(response)
      const newLikesArray = posts.map(post => {
        if (post._id === response._id) {
          return response;
        } else {
          return post;
        }
      })

      setPosts(newLikesArray);
    } catch (error) {
      console.log(error);
    }
  }

 
  return (
    <div className="home__wrapper">
      {
        posts && posts.map((post, index) => {
          return (
            <div className="card home__card" key={post._id}>
              <h5>{post.postedBy.name}</h5>
              <div className="card-image">
                <img className='home__img' src={post.photo} alt='img__photo' />
              </div>
              <div className="card-content">
              {
                  post.likes.includes(state._id)
                  ?
                  
                    <span className='like__post'>
                      <FavoriteIcon
                        style={{ color: 'red' }}
                        onClick={() => { unlikePost(post._id) }}
                      />
                    </span>
                  
                  :
                  
                    <span className='like__post'>
                      <FavoriteBorderIcon
                        onClick={() => { likePost(post._id) }}
                      />
                    </span>
                 
                }
                <h6>{ post.likes.length } likes</h6>
                <h6>{ post.title }</h6>
                <p>{ post.body }</p>
                <input type='text' placeholder='add a comment' />
              </div>
            </div>
          )
        })
      }
      
    </div>
  )
}

export default Home