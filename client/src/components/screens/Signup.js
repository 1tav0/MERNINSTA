import React, { useState } from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const uploadData = async () => {
    try {
      const request = await fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "",
          email: "",
          password: ""
        })
      });
      const response = await request.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='card__wrapper'>
      <div className="card card__child input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder='name'
          value={name}
          onChange={event => {
            setName(event.target.value)
          }}
        />
        <input
          type="text"
          placeholder='email'
          value={email}
          onChange={event => {
            setEmail(event.target.value)
          }}
        />
        <input
          type="text"
          placeholder='password'
          value={password}
          onChange={event => {
            setPassword(event.target.value)
          }}
        />
        <button className="btn waves-effect waves-light #1e88e5 blue darken-1 signup__button"
          onClick={()=>uploadData()}
        >SignUp
        </button>
        <h5>
          <Link to="/signin">Already have an account ?</Link>
        </h5>
      </div>
      
    </div>
  )
}

export default Signup