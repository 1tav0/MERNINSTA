import React, { useEffect, useState } from 'react'
import './Home.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const Home = () => {
  const [posts, setPosts] = useState([]);
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
        console.log(response)
        setPosts(response.posts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])
  return (
    <div className="home__wrapper">
      {
        posts.map((post, index) => {
          return (
            <div className="card home__card" key={post._id}>
              <h5>{post.postedBy.name}</h5>
              <div className="card-image">
                <img className='home__img' src={post.photo} alt='img__photo' />
              </div>
              <div className="card-content">
                <FavoriteBorderIcon />
                <h6>likes</h6>
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