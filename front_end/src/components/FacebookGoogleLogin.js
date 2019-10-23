import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import { loginWithFacebookGoogle } from "../actions/loginWithFacebookGoogle";

class FacebookGoogleLogin extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  componentClicked = () => console.log("clicked");

  responseFacebook = response => {
    console.log("facebook login response");
    console.log(response);
    var firstName = response.name
      .split(" ")
      .slice(0, -1)
      .join(" ");
    var lastName = response.name
      .split(" ")
      .slice(-1)
      .join(" ");

    const loginData = {
      firstName: firstName,
      lastName: lastName,
      email: response.email,
      password: "facebooklogin"
    };
    this.props.loginWithFacebookGoogle(loginData, this.props.history);
  };

  responseGoogle = response => {
    console.log("google login response");
    const loginData = {
      firstName: response.w3.ofa,
      lastName: response.w3.wea,
      email: response.w3.U3,
      password: "googlelogin"
    };
    this.props.loginWithFacebookGoogle(loginData, this.props.history);
  };

  onFailure = error => {
    console.log("google login error ", error);
  };

  render() {
    let fbContent;
    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <FacebookLogin
            style={{ borderRadius: 2 }}
            appId="3146580042050394"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
          />
          <br />
          <GoogleLogin
            style={{ width: 242 }}
            clientId="457180824943-lv16voqfvsiurmjcesmbp6qq9t9iv03o.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.onFailure}
          />
          <br />
        </div>
      );
    }
    return <div>{fbContent}</div>;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { loginWithFacebookGoogle }
)(FacebookGoogleLogin);
