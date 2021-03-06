import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA,USERS_LIKES_STATE_CHANGE
} from "../constants";

const initialState = {
  users: [],
  feed: [],
  usersFollowingLoaded: 0,
};

export const users = (state = initialState, action) => {
    console.log("state1222",state.feed)
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
        // action.user
      };

    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        
        feed:[...state.feed, ...action.posts],
      };

    case USERS_LIKES_STATE_CHANGE:
      console.log('abcd',{...state.feed});
      
      return {
        ...state,        
         feed: state.feed?.map(post => post.id == action.postId ? 
               {...post,currentUserLike: action.currentUserLike} : 
             post              
             )
        
      };

      
// To Clear data
    case CLEAR_DATA: {
      return initialState;

    }

    default:
      return state;
  }
};
