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
import { editFileAction } from "../actions/editFileAction";
import { deleteFileAction } from "../actions/deleteFileAction";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
const styles = {
  root: {
    color: "white"
  }
};

class LandingPage extends Component {
  handleLogout = () => {
    this.props.logoutAction();
  };

  componentWillMount() {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/signin");
    }
  }

  componentDidMount() {
    // console.log(
    //   "this.props.user.userInfo.email-",
    //   this.props.user.userInfo.email
    // );
    // console.log(this.props.user.userInfo);
    if (this.props.user.userInfo) {
      this.props.getAllFilesAction(this.props.user.userInfo.email);
    }
  }

  handleEditFile = file => {
    this.props.editFileAction(file, this.props.history);
  };
  handleDeleteFile = file => {
    this.props.deleteFileAction(file, this.props.history);
  };
  renderFilesList = files => {
    const temp = files.map(file => {
      return (
        <div key={file.filename} style={{ marginTop: 20 }}>
          <Card>
            <CardHeader title={file.filename} />
            <CardContent>File description: {file.description}</CardContent>
            <CardMedia>
              <a target="_parent" href={file.url}>
                click to download
              </a>
            </CardMedia>
            <Button onClick={() => this.handleEditFile(file)}>Edit</Button>
            <Button onClick={() => this.handleDeleteFile(file)}>
              Delete File
            </Button>
          </Card>
        </div>
      );
    });
    return temp;
  };

  render() {
    if (this.props.user.isLoggedIn) {
      return (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12}>
            <AppBar
              style={{
                backgroundImage:
                  "linear-gradient(to right, #0c4b78, #3d4e96, #2c76a9)"
              }}
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
          <Grid item xs={8}>
            {this.props.files ? (
              <div style={{ marginTop: 50 }}>
                {this.renderFilesList(this.props.files)}
              </div>
            ) : null}
          </Grid>
        </Grid>
      );
    } else {
      // this.props.history.push("/signin");
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
  { logoutAction, getAllFilesAction, editFileAction, deleteFileAction }
)(withRouter(withStyles(styles)(LandingPage)));
