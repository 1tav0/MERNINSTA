import React from 'react'
import './Home.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const Home = () => {
  return (
    <div className="home__wrapper">
      <div className="card home__card">
        <h5>Tavo</h5>
        <div className="card-image">
          <img className='home__img' src='https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg' alt='img__photo' />
        </div>
        <div className="card-content">
          <FavoriteBorderIcon />
          <h6>likes</h6>
          <h6>Title of post</h6>
          <p>This is the post body</p>
          <input type='text' placeholder='add a comment' />
        </div>
      </div>
      
    </div>
  )
}

export default Home