import { GET_ALL_FILE, ADMIN_SIGNIN_GET_FILES } from "../actions/types";

const initialState = {
  files: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_FILE:
      console.log("get all files reducer ", action.payload);
      return {
        ...state,
        files: action.payload
      };
    case ADMIN_SIGNIN_GET_FILES:
      console.log("Admin get all files reducer ", action.payload);
      return {
        ...state,
        files: action.payload
      };
    default:
      return state;
  }
}
