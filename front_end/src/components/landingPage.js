import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { logoutAction } from "../actions/signUpSignIn";
import { getAllFilesAction } from "../actions/getAllFiles";
import Typography from "@material-ui/core/Typography";

const styles = {
  root: {
    color: "white"
  }
};

class LandingPage extends Component {
  handleLogout = () => {
    this.props.logoutAction();
  };

  componentDidMount() {
    // console.log(
    //   "this.props.user.userInfo.email-",
    //   this.props.user.userInfo.email
    // );
    this.props.getAllFilesAction(this.props.user.userInfo.email);
  }

  render() {
    if (this.props.user.isLoggedIn) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppBar
              style={{
                backgroundImage:
                  "linear-gradient(to right, #0c4b78, #3d4e96, #2c76a9)"
              }}
              position="static"
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ color: "white", marginLeft: 10 }}
                >
                  Hi {this.props.user.userInfo.firstname}!
                </Typography>
                <Link
                  style={{ color: "white", marginLeft: "auto", marginRight: 0 }}
                  to="/uploadpage"
                >
                  Upload Files
                </Link>
                <Link
                  onClick={this.handleLogout}
                  style={{ color: "white", marginLeft: "auto", marginRight: 0 }}
                  to="/signin"
                >
                  Log out
                </Link>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            {this.props.files ? (
              <div>
                <Card>file name : {this.props.files[0].filename}</Card>
                <Card>file description: {this.props.files[0].description}</Card>
                <Card>
                  <a target="_parent" href={this.props.files[0].file}>
                    click to download
                  </a>
                </Card>
              </div>
            ) : null}
            {/* <Card>{this.props.files[0].filename}</Card> */}
            {/* <Card>{this.props.files[0].file.data}</Card> */}
          </Grid>
        </Grid>
      );
    } else {
      this.props.history.push("/signin");
      return <div></div>;
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  files: state.files.files
});

export default connect(
  mapStateToProps,
  { logoutAction, getAllFilesAction }
)(withRouter(withStyles(styles)(LandingPage)));
