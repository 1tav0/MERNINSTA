import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigate('/signin')
  }
  const renderList = () => {
    if (state) {
      return [
        <ul id="nav-mobile" className="right" key="1">
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/createpost">CreatePost</Link></li>
          <li>
            <button className="btn waves-effect waves-light #b71c1c red darken-4"
              onClick={() => logOut()}
              style={{fontSize:"x-small", width: "auto"}}
            >
              LogOut
            </button>
          </li>
        </ul>
      ]
    } else {
      return [
        <ul id="nav-mobile" className="right" key="2">
          <li><Link to="/signin">Signin</Link></li>
          <li><Link to="/signup">SignUp</Link></li>
        </ul>
      ]
    }
  }
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state ? "/" : "/signing"} className="brand-logo left">Instagram</Link>
        {renderList()}
    </div>
  </nav>
  )
}

export default Navbar