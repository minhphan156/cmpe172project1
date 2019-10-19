import { GET_ALL_FILE } from "../actions/types";

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
    default:
      return state;
  }
}
