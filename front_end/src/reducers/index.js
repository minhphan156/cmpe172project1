import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import uploadReducer from "./uploadReducer";
import getAllFilesReducer from "./getAllFilesReducer";
import editFileReducer from "./editFileReducer";

export default combineReducers({
  user: usersReducer,
  upload: uploadReducer,
  files: getAllFilesReducer,
  fileEdit: editFileReducer
});
