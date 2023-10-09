import React from 'react';
import './Signin.css';
import { Link } from 'react-router-dom';
const Signin = () => {
  return (
    <div className='card__wrapper'>
      <div className="card card__child input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder='email' />
        <input type="text" placeholder='password' />
        <button className="btn waves-effect waves-light #1e88e5 blue darken-1">Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
      
    </div>
  )
}

export default Signin