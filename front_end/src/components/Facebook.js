import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { connect } from "react-redux";
import { loginWithFacebook } from "../actions/loginWithFacebook";
import { GoogleLogin } from "react-google-login";

class Facebook extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  componentClicked = () => console.log("clicked");

  responseFacebook = response => {
    console.log(response);
    // this.setState({
    //   isLoggedIn: true,
    //   userID: response.userID,
    //   name: response.name,
    //   email: response.email,
    //   picture: response.picture.data.url
    // });
    var firstName = response.name
      .split(" ")
      .slice(0, -1)
      .join(" ");
    var lastName = response.name
      .split(" ")
      .slice(-1)
      .join(" ");
    console.log(firstName);
    console.log(lastName);

    const loginData = {
      firstName: firstName,
      lastName: lastName,
      email: response.email,
      password: "facebooklogin"
    };
    this.props.loginWithFacebook(loginData, this.props.history);
  };

  responseGoogle = response => {
    console.log("================");
    console.log(response);
    // console.log(response.WE);
    // console.log(response.w3.U3);
    // console.log(response.w3.ofa);
    // console.log(response.w3.wea);

    // this.setState({
    //   isLoggedIn: true,
    //   userID: response.userID,
    //   name: response.name,
    //   email: response.email,
    //   picture: response.picture.data.url
    // });
    // var firstName = response.name
    //   .split(" ")
    //   .slice(0, -1)
    //   .join(" ");
    // var lastName = response.name
    //   .split(" ")
    //   .slice(-1)
    //   .join(" ");
    // console.log(firstName);
    // console.log(lastName);

    const loginData = {
      firstName: response.w3.ofa,
      lastName: response.w3.wea,
      email: response.w3.U3,
      password: "googlelogin"
    };
    this.props.loginWithFacebook(loginData, this.props.history);
  };

  onFailure = error => {
    alert(error);
  };
  render() {
    let fbContent;
    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        <div>
          <FacebookLogin
            appId="3146580042050394"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
          />
          <GoogleLogin
            clientId="457180824943-lv16voqfvsiurmjcesmbp6qq9t9iv03o.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.onFailure}
          />
        </div>
      );
    }
    return <div>{fbContent}</div>;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { loginWithFacebook }
)(Facebook);
