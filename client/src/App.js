import './App.css';
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { createContext, useReducer, useContext, useEffect } from 'react';
import { reducer, initialState } from './reducers/userReducer'

//used to provide & consume user-related data across different prts of app, for managing user authentication & sharing user info.
export const UserContext = createContext();

//to access history outside Router
const Routing = () => {
  const navigate = useNavigate();
  //to access the 'state' and dispatch function from the UserContext. aka read and update user-related data.
  const { state, dispatch } = useContext(UserContext);
  
  useEffect(() => {
    //attempts to retrieve user data from the local storage. If user data is found, it dispatches an action of type "USER" with the user data as the payload.
    //If user data is not found, navigates to the "/signin" route, assuming that the user needs to sign in.
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate('/signin');
    }
  }, [])

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/followingposts" element={<SubscribedUserPosts />} />
    </Routes>
  )
}

function App() {
  // You initialize your state using useReducer, providing the initial state and the reducer function.
  //'useReducer' to manage the global state of the app. 
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    //This makes the state and dispatch available to all components that consume the UserContext.
    <UserContext.Provider value={{state, dispatch}}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
    
  );
}

export default App;
