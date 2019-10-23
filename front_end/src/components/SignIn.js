import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FacebookGoogleLogin from "./FacebookGoogleLogin";
import { verifyAccount } from "../actions/signUpSignIn";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSignInFormChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const signInInfo = {
      password: this.state.password,
      email: this.state.email
    };
    this.props.verifyAccount(signInInfo, this.props.history);
    event.preventDefault();
  };

  render() {
    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10%",
          width: "30%"
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
          onSubmit={this.handleSubmit}
        >
          <h2
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            Sign In
          </h2>

          <TextField
            id="outlined-email"
            value={this.state.email}
            onChange={this.handleSignInFormChange}
            name="email"
            label="email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-password"
            type="password"
            value={this.state.password}
            onChange={this.handleSignInFormChange}
            name="password"
            label="Password"
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 10, marginBottom: 15 }}
          >
            Sign in
          </Button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <FacebookGoogleLogin history={this.props.history} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Link to="/signup"> Sign up</Link> <br />
              <Link to="/AdminSignInPage"> Admin Sign in Page</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { verifyAccount }
)(withRouter(SignIn));
