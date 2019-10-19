import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { verifyAccount } from "../actions/signUpSignIn";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Facebook from "./Facebook";
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
    // console.log(this.state);
  };

  handleSubmit = event => {
    event.preventDefault();

    const signInInfo = {
      password: this.state.password,
      email: this.state.email
    };
    console.log("handlesubmit Sign in");
    this.props.verifyAccount(signInInfo, this.props.history);

    event.preventDefault();
  };

  render() {
    return (
      <div className="signin">
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10%",
            width: "30%"
          }}
        >
          <h2>Sign In</h2>
          <form
            style={{
              display: "flex",
              flexDirection: "column"
            }}
            onSubmit={this.handleSubmit}
          >
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
              Sign In
            </Button>
          </form>
          <br />
          Don't have an account? <Link to="/signup">Sign up</Link> or <br />{" "}
          <Facebook history={this.props.history} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { verifyAccount }
)(withRouter(SignIn));
