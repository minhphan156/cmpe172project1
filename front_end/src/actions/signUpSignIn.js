import axios from "axios";
import { IS_LOGGED_IN, LOG_OUT } from "./types";
export const createAccount = (signUpInfo, history) => dispatch => {
  axios
    .post("/users/newuser", signUpInfo)
    .then(res => {
      console.log("new account created ", res);
      history.push("/");
      dispatch({
        type: IS_LOGGED_IN,
        payload: signUpInfo
      });
      alert("Successfully created account client.");
    })
    .catch(error => {
      alert("There was an error creating your account client.");
      console.log(error);
    });
};

export const verifyAccount = (signInInfo, history) => dispatch => {
  axios
    .post("/users/verifyuser", signInInfo)
    .then(res => {
      console.log("push to homepage");
      dispatch({
        type: IS_LOGGED_IN,
        payload: res.data
      });
      history.push("/");
    })
    .catch(error => {
      alert("There was an error verify your account client.");
      console.log(error);
    });
};

export const logoutAction = () => {
  return {
    type: LOG_OUT
  };
};
