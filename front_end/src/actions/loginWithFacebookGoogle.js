import axios from "axios";
import { IS_LOGGED_IN } from "./types";
export const loginWithFacebookGoogle = (signInInfo, history) => dispatch => {
  axios
    .post("http://localhost:3001/users/loginWithFacebook", signInInfo)
    .then(res => {
      console.log("loginWithFacebook or google action", res);

      dispatch({
        type: IS_LOGGED_IN,
        payload: signInInfo
      });
      history.push("/");
      alert("Successfully login facebook account client.");
    })
    .catch(error => {
      alert("There was an error login facebook account client.");
      console.log(error);
    });
};
