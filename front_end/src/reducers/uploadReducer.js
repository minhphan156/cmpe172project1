import { UPLOAD_FILE } from "../actions/types";

const initialState = {
  upload: null
};

/*
 ...state = current state

Object.assign({}, state, {upload: action.payload}) = 
 {...state,upload: action.payload};
*/
export default function(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_FILE:
      return {
        ...state,
        upload: action.payload
      };
    default:
      return state;
  }
}
