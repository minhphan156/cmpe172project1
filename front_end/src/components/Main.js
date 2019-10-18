import React, { Component } from "react";
import store from "../store";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import UploadPage from "./UploadPage";
import LandingPage from "./landingPage";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/uploadpage" component={UploadPage} />
        </Router>
      </Provider>
    );
  }
}

export default Main;
