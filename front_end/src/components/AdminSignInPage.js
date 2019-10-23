import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { adminGetAllFilesAction } from "../actions/getAllFiles";
import { logoutAction } from "../actions/signUpSignIn";

class AdminSignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //TODO: REMOVE WHEN DONE DEVELOPMENT
      email: "adminpanel@gmail.com",
      password: "adminminhphan172"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.logoutAction();
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
    this.props.adminGetAllFilesAction(signInInfo, this.props.history);
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
          <h2
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            Sign In
          </h2>
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
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { adminGetAllFilesAction, logoutAction }
)(withRouter(AdminSignInPage));
