import axios from "axios";
import { getAllFilesAction, adminGetAllFilesAction } from "./getAllFiles";
export const deleteFileAction = (file, history) => dispatch => {
  axios
    .post("/users/deletefile", file)
    .then(res => {
      console.log("deletefileaction-", res);
      dispatch(getAllFilesAction(file.email));
      history.push("/");
    })
    .catch(error => {
      console.log(error);
    });
};

export const adminDeleteFileAction = (file, history) => dispatch => {
  axios
    .post("/users/deletefile", file)
    .then(res => {
      console.log("deletefileaction-", res);
      dispatch(
        adminGetAllFilesAction({
          password: "adminminhphan172",
          email: "adminpanel@gmail.com"
        })
      );
      history.push("/adminpage");
    })
    .catch(error => {
      console.log(error);
    });
};
