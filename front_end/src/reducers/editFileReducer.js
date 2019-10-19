import { EDIT_FILE } from "../actions/types";

const initialState = {
  fileEdit: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EDIT_FILE:
      return { ...state, fileEdit: action.payload };
    default:
      return state;
  }
}
