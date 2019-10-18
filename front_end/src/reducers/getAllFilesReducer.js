import { GET_ALL_FILE } from "../actions/types";

const initialState = {
  files: null
};

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_FILE:
      //   action.payload.map(fileData => {
      //     if (fileData.file != null) {
      //       var base64Flag = "data:image/jpeg;base64,";
      //       var imageStr = arrayBufferToBase64(fileData.file.data);
      //       const img = base64Flag + imageStr;
      //       fileData.file.data = img;
      //     } else {
      //       fileData.file = { data: null };
      //     }
      //   });
      console.log("files reducer ==", action.payload);

      return {
        ...state,
        files: action.payload
      };
    default:
      return state;
  }
}
