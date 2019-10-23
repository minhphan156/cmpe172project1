import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { adminDeleteFileAction } from "../actions/deleteFileAction";
import { adminGetAllFilesAction } from "../actions/getAllFiles";
import { logoutAction } from "../actions/signUpSignIn";
import Typography from "@material-ui/core/Typography";

const styles = {
  root: {
    color: "white"
  }
};
class AdminPage extends Component {
  handleLogout = () => {
    this.props.logoutAction();
  };
  componentWillMount() {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/signin");
    }
    // } else {
    //   this.props.adminGetAllFilesAction(
    //     this.props.user.userInfo,
    //     this.props.history
    //   );
    // }
  }
  handleDeleteFile = file => {
    this.props.adminDeleteFileAction(file, this.props.history);
  };
  renderFilesList = files => {
    const temp = files.map(file => {
      return (
        <div key={file.filename + file.email} style={{ marginTop: 20 }}>
          <Card>
            <CardContent>File filename: {file.filename}</CardContent>

            <CardContent>File email: {file.email}</CardContent>
            <CardContent>File description: {file.description}</CardContent>
            {/* <CardMedia>
              <a target="_parent" href={file.url}>
                click to download
              </a>
            </CardMedia> */}
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
                Hi{" "}
                {this.props.user.userInfo
                  ? this.props.user.userInfo.firstname
                  : null}
                !
              </Typography>
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
  }
}

const mapStateToProps = state => ({
  user: state.user,
  files: state.files.files
});

export default connect(
  mapStateToProps,
  { adminDeleteFileAction, adminGetAllFilesAction, logoutAction }
)(withRouter(withStyles(styles)(AdminPage)));
