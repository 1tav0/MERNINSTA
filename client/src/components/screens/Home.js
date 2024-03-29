import React, { useContext, useEffect, useRef, useState } from 'react'
import './Home.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../../App'
import { Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const inputRef = useRef([])
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
      //makes an HTTP request to a route
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
      //awaits the response from the server, then parses it as JSON.
      const response = await request.json();
      // console.log(response)
      const newLikesArray = posts.map(post => {
        // If the current post's _id matches the response's _id, this is the post that was liked.
        // It returns an updated post object with specific properties.
        if (post._id === response._id) {
          return {
            ...response,// Replace the entire post with the updated post information.
            postedBy: response.postedBy,// preserve the updated postedBy
            likes: response.likes,// Preserve the updated likes.
            comments: post.comments// Preserve the original comments.
          }
        } else {
          // If the current post's _id does not match the response's _id, this is not the post that was liked.
          // It returns the original post data with 
          return {
            ...post, // Preserve the original post information.
            postedBy: post.postedBy,
            likes: post.likes,
            comments: post.comments
          }
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
          return {
            ...response,
            postedBy: response.postedBy,
            likes: response.likes,
            comments: post.comments
          }
        } else {
          return {
            ...post,
            postedBy: post.postedBy,
            likes: post.likes,
            comments: post.comments
          }
        }
      })

      setPosts(newLikesArray);
    } catch (error) {
      console.log(error);
    }
  }

  const makeComment = async (text,postId, index) => {
    try {
      const request = await fetch('/comment', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({ //the request body
          text,
          postId
        })
      })
      const response = await request.json();
      // Ensure the response structure matches the expected format & theres no error in the server side
      if (response.error) {
        console.log(response.error);
        return;
      }
      // console.log(response);
      //Update the comment's "postedBy" object with the "photo" property
      //map through the comments in the response & check if the user who posted the comment has a photo property. If not, it sets the user.photo to a default image ("/broken-image.jpg") ensuring that the user's photo is always defined.
      const updatedComments = response.comments.map(comment => {
        //who posted the comment.
        const user = comment.postedBy;
        if (!user.photo) {
          // It checks if the user has a `photo` property.
          user.photo = "/broken-image.jpg"
        }
        return {
          ...comment, // It spreads the properties of the original comment to preserve them.
          postedBy: user // It updates the `postedBy` property with the user object (which may now contain the photo property).
        }
      })
      //maps through the posts and looks for the post that matches the given index and postId. When it finds the matching post, it updates the comments property of that post with the new comments from the response, & also updates the postedBy property to include user data.
      // This is essentially returning the post with the added comment and other updated properties.
      const newData = posts.map((post, i) => {
        if (i === index && post._id === response._id) {
          // This condition checks if the current post is the one where a comment was added, and it's at the specified index.
          // If so, it returns an updated post object with the following properties:
          return {
            ...response,// Replace the entire post with the updated post information.
            postedBy: response.postedBy,// Preserve the original postedBy.
            likes: response.likes,// Preserve the original likes.
            updatedComments// Add the updated comments to this post.
          }
          // This is returning the original post with updated comments.
        } else if (post._id === response._id) {
          // This condition checks if the current post matches the post where the comment was added but is not at the specified index.
          // If so, it returns the original post with some updates.
          return {
            ...post,// Preserve the original post information.
            postedBy: post.postedBy,
            likes: post.likes,
            comments: response.comments // Replace the comments array with the updated comments.
          }
          // This is essentially keeping the post as it is.
        } else {
           // If neither of the above conditions matches, it's not the post where the comment was added.
          // In this case, it returns the original post without any changes.
          return post;
        }
      })
      //called to update the state with the new data in newData, causing the component to re-render & display the updated data, including the new comment.
      setPosts(newData);

      if (inputRef.current[index]) {
        inputRef.current[index].form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deletePost = async (postid) => {
    try {
      console.log(postid);
      const request = await fetch(`/deletepost/${postid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      const response = await request.json();
      if (response.error) {
        console.log(response.error);
        return;
      }

      const newData = posts.filter(post => {
        return post._id !== response._id;
      })

      setPosts(newData);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteComment = async (commentid) => {
    try {
      const request = await fetch(`/deletecomment/${commentid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });

      const response = await request.json();
      if (response.error) {
        console.log(response.error);
        return;
      }

      const newData = posts.map(post => {
        // If the current post's _id matches the response's _id, this is the post where the comment was deleted.
        // You would want to return the updated post information.
        if (post._id === response._id) {
          return {
            ...response,
            postedBy: response.postedBy,
            likes: response.likes
          }
        } else {
          // If the current post's _id does not match the response's _id, this is not the post where the comment was deleted.
          // You want to preserve the original post information but update its comments array.
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment._id === commentid) {
                //indicating that this comment should be removed.
                return null;
              } else {
                //If the comment does not match the commentId, it's preserved.
                return comment;
              }
            })
            .filter(comment => comment != null)
            //After mapping over the comments array and setting the deleted comment to null, this line filters out the null entries,
          }
        }
      });

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
              <h5
                style={{
                  margin: "10px auto"
                }}
              >
                {
                  <Link to={
                    post.postedBy._id !== state._id
                      ?
                      `/profile/${post.postedBy._id}`
                      :
                      "/profile"}
                  >
                    {post.postedBy.name}
                  </Link>
                }
                {
                  post.postedBy._id === state._id
                    &&
                    <IconButton
                  onClick={() => {
                    deletePost(post._id)
                  }}
                  style={{
                    color: 'red',
                    float: "right"
                  }}
                  >
                    <DeleteIcon/>
                  </IconButton>
                }
              </h5>
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
                  post.comments.map((record, index) => {
                    return (
                      <div className='parent' key={record._id}>
                        <h6
                          key={record._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "500",
                                marginRight: "10px",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              <Avatar className='avatar' 
                                  style={{
                                    width: '25px',
                                    height: '25px',
                                    marginRight:'8px'
                                  }}
                                  src={ post.comments[index].postedBy.photo }
                              />
                              {record.postedBy.name}
                            </span>
                            <span>
                              {record.text}
                            </span>
                          </span>
                          <span>
                            {
                              record.postedBy._id === state._id
                              &&
                              <span className="delete__icon">
                                <DeleteIcon
                                  onClick={() => deleteComment(record._id)}
                                  style={{
                                    color: 'red',
                                    float: "right",
                                    cursor: 'pointer'
                                  }}
                                />
                              </span>
                            }
                          </span>
                        </h6>
                      </div>
                    )
                  })
                }
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    // console.log(e.target[0].value)
                    makeComment(e.target[0].value, post._id, index)
                    e.target.reset()
                  }}
                >
                  <input type='text' placeholder='add a comment'
                    ref={()=> inputRef.current[index]}
                  />
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