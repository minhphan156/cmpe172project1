import { DELETE_FILE } from "./types";
import axios from "axios";
import { getAllFilesAction } from "./getAllFiles";
export const deleteFileAction = (file, history) => dispatch => {
  axios
    .post("http://localhost:3001/users/deletefile", file)
    .then(res => {
      console.log("deletefileaction-", res);
      dispatch(getAllFilesAction(file.email));
      history.push("/");
    })
    .catch(error => {
      console.log(error);
    });
};
