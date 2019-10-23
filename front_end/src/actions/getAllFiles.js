import { GET_ALL_FILE, ADMIN_SIGNIN_GET_FILES } from "./types";
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

export const adminGetAllFilesAction = (signInInfo, history) => dispatch => {
  axios
    .post("http://localhost:3001/users/adminGetAllFiles", signInInfo)
    .then(res => {
      console.log("getAllFilesAction-", res);
      dispatch({
        type: ADMIN_SIGNIN_GET_FILES,
        payload: res.data
      });
      history.push("/adminpage");
    })
    .catch(err => console.log(err));
};
