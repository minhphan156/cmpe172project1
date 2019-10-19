import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { createAccount } from "../actions/signUpSignIn";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      password: "",
      lastName: "",
      email: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSignUpFormChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    // console.log(this.state);
  };

  handleSubmit = event => {
    event.preventDefault();

    const signUpInfo = {
      firstName: this.state.firstName,
      password: this.state.password,
      lastName: this.state.lastName,
      email: this.state.email
    };
    console.log("handlesubmit Sign up");
    this.props.createAccount(signUpInfo, this.props.history);

    event.preventDefault();
  };

  render() {
    // console.log(this.state);
    return (
      <div className="signup">
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10%",
            width: "30%"
          }}
        >
          <h2>Create an Account</h2>
          <form
            style={{
              display: "flex",
              flexDirection: "column"
            }}
            onSubmit={this.handleSubmit}
          >
            <TextField
              required
              id="outlined-firstName"
              value={this.state.firstName}
              onChange={this.handleSignUpFormChange}
              name="firstName"
              label="First name"
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              id="outlined-lastName"
              value={this.state.lastName}
              onChange={this.handleSignUpFormChange}
              name="lastName"
              label="Last name"
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              id="outlined-password"
              type="password"
              value={this.state.password}
              onChange={this.handleSignUpFormChange}
              name="password"
              label="Password"
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              id="outlined-email"
              value={this.state.email}
              onChange={this.handleSignUpFormChange}
              name="email"
              label="email"
              margin="normal"
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 10, marginBottom: 15 }}
            >
              Sign Up
            </Button>
          </form>
          <br />
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { createAccount }
)(SignUp);
