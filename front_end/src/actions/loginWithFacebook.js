import axios from "axios";
import { IS_LOGGED_IN, LOG_OUT } from "./types";
export const loginWithFacebook = (signUpInfo, history) => dispatch => {
  axios
    .post("http://localhost:3001/users/loginWithFacebook", signUpInfo)
    .then(res => {
      console.log(res);
      history.push("/");
      dispatch({
        type: IS_LOGGED_IN,
        payload: signUpInfo
      });
      alert("Successfully login facebook account client.");
    })
    .catch(error => {
      alert("There was an error login facebook account client.");
      console.log(error);
    });
};
