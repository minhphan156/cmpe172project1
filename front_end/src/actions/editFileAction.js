import { EDIT_FILE } from "./types";
import axios from "axios";
export const editFileAction = (file, history) => {
  history.push("/editfile");
  return {
    type: EDIT_FILE,
    payload: file
  };
};

export const editFileDataBase = (file, history) => dispatch => {
  axios
    .post("http://localhost:3001/users/editfile", file)
    .then(res => {
      //   dispatch(getAllFilesAction(file.email));
      history.push("/");
    })
    .catch(error => {
      console.log(error);
    });
};
