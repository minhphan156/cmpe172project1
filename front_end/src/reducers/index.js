import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import uploadReducer from "./uploadReducer";
import getAllFilesReducer from "./getAllFilesReducer";

export default combineReducers({
  user: usersReducer,
  upload: uploadReducer,
  files: getAllFilesReducer
});
