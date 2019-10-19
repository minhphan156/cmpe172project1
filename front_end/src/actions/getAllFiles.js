import { GET_ALL_FILE } from "./types";
import axios from "axios";

export const getAllFilesAction = email => dispatch => {
  axios
    .post("http://localhost:3001/users/getAllFiles", { email })
    .then(res => {
      console.log("getAllFilesAction-", res);
      dispatch({
        type: GET_ALL_FILE,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
