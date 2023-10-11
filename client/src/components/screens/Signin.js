import React, { useState } from 'react';
import './Signin.css';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signinData = async () => {
    try {
      const mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if(!mailformat.test(email))
      {
        M.toast({html: "Invalid Email Address", classes: "#d50000 red accent-4"})
        return;
      }
      const request = await fetch('/signin', {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const response = await request.json();
      console.log(response);
      if (response.error) {
        M.toast({html: response.error, classes: "#d50000 red accent-4"})
      } else {
        localStorage.setItem("jwt", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        M.toast({ html: "Successfully logged in!", classes: "#00c853 green accent-4" })
        navigate('/')
      }
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
          placeholder='email'
          value={email}
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder='password'
          value={password}
          onChange={event => {
            setPassword(event.target.value);
          }}
        />
        <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
          onClick={() => signinData()}
        >Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
      
    </div>
  )
}

export default Signin