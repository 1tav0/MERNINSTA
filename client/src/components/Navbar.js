import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css';
const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    M.Modal.init(searchModal.current);
  })

  const logOut = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigate('/signin')
  }
  const renderList = () => {
    if (state) {
      return [
        <ul id="nav-mobile" className="right" key="1">
          <li key="search"> <i data-target="modal1" className='large material-icons modal-trigger'> search </i> </li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/createpost">CreatePost</Link></li>
          <li><Link to="/followingposts">Following</Link></li>
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
    <div id="modal1" className="modal" ref = {searchModal}
      style={{color: "black"}}
    >
      <div className="modal-content">
        <div className='input__text'>
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            />
            <ul className="collection">
              <li className="collection-item">Alvin</li>
              <li className="collection-item">Alvin</li>
              <li className="collection-item">Alvin</li>
              <li className="collection-item">Alvin</li>
            </ul>
        </div>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat">
          Agree
        </button>
      </div>
    </div>
  </nav>
  )
}

export default Navbar