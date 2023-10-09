import React from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'
const Signup = () => {
  return (
    <div className='card__wrapper'>
      <div className="card card__child input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder='name' />
        <input type="text" placeholder='email' />
        <input type="text" placeholder='password' />
        <button className="btn waves-effect waves-light #1e88e5 blue darken-1">Login
        </button>
        <h5>
          <Link to="/signin">Already have an account ?</Link>
        </h5>
      </div>
      
    </div>
  )
}

export default Signup