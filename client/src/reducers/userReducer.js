//initially we dont have any data related to user
//The initial state represents the default or starting state for your application's data.
export const initialState = null;
//A reducer is a function that specifies how your state should change in response to different actions.
//action: is an object that describes what change should be made to the state.
//includes a 'type' property that indicates the type of action to be performed
//includes a 'payload' property that may contain data associated with the action.
//action.type = "USER", means update the state with user-related data.
//The new state will be set to action.payload, which is the data associated with the action.
/**This reducer can be used with the useReducer hook in a React component to manage and update state based on different actions. When an action is dispatched, the reducer processes the action and returns a new state, and React updates the component's state accordingly.***/
export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload; 
  }

  if (action.type === "CLEAR") {
    return null;
  }

  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers, //append followers coming from action.payload
      following: action.payload.following
    }
  }

  return state;
}