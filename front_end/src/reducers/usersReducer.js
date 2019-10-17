import { IS_LOGGED_IN, LOG_OUT } from "../actions/types";

const initialState = {
  isLoggedIn: false,
  userInfo: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_LOGGED_IN:
      return { ...state, isLoggedIn: true, userInfo: action.payload };
    case LOG_OUT:
      return { ...state, isLoggedIn: false, userInfo: null };
    default:
      return state;
  }
}
