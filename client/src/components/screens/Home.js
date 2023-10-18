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
      // console.log(response)
      const newLikesArray = posts.map(post => {
        if (post._id === response._id) {
          return { ...response, postedBy: response.postedBy, likes: response.likes, comments: post.comments }
        } else {
          return { ...post, postedBy: post.postedBy, likes: post.likes, comments: post.comments }
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
      // console.log(response)
      const newLikesArray = posts.map(post => {
        if (post._id === response._id) {
          return { ...response, postedBy: response.postedBy, likes: response.likes, comments: post.comments }
        } else {
          return { ...post, postedBy: post.postedBy, likes: post.likes, comments: post.comments }
        }
      })

      setPosts(newLikesArray);
    } catch (error) {
      console.log(error);
    }
  }

  const makeComment = async (text,postId) => {
    try {
      const request = await fetch('/comment', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          text,
          postId
        })
      })
      const response = await request.json();
      // Ensure the response structure matches the expected format
      if (response.error) {
        console.log(response.error);
        return;
      }
      console.log(response);
      const newData = posts.map(post => {
        if (post._id === response._id) {
          return response;
        } else {
          return post;
        }
      })

      setPosts(newData);
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
                <p>{post.body}</p>
                {/* When we make a comment */}
                {
                  post.comments.map(record => {
                    return (
                      <h6>
                        <span>
                          {record.postedBy.name}
                        </span>
                        <span>
                          {record.text}
                        </span>
                      </h6>
                    )
                  })
                }
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    console.log(e.target[0].value)
                    makeComment(e.target[0].value, post._id)
                    e.target.reset()
                  }}
                >
                  <input type='text' placeholder='add a comment' />
                </form>
              </div>
            </div>
          )
        })
      }
      
    </div>
  )
}

export default Home