import {
  IS_LOGGED_IN,
  LOG_OUT,
  ADMIN_SIGNIN_GET_FILES
} from "../actions/types";

const initialState = {
  isLoggedIn: false,
  userInfo: null
};

//********TODO***make this fake data for development , turn back later */
// const initialState = {
//   isLoggedIn: true,
//   userInfo: {
//     email: "a",
//     firstname: "a",
//     lastname: "a",
//     password: "a"
//   }
// };

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_LOGGED_IN:
      return { ...state, isLoggedIn: true, userInfo: action.payload };
    case LOG_OUT:
      return { ...state, isLoggedIn: false, userInfo: null };
    case ADMIN_SIGNIN_GET_FILES:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: { firstname: "adminpanel@gmail.com" }
      };
    default:
      return state;
  }
}
