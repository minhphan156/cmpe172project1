import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { logoutAction } from "../actions/signUpSignIn";
import { getAllFilesAction } from "../actions/getAllFiles";
import { editFileAction } from "../actions/editFileAction";
import { deleteFileAction } from "../actions/deleteFileAction";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
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

  createData = (
    email,
    filename,
    description,
    uploadtime,
    updatedtime,
    download,
    editfile,
    deletefile
  ) => {
    return {
      email,
      filename,
      description,
      uploadtime,
      updatedtime,
      download,
      editfile,
      deletefile
    };
  };

  renderFilesList = files => {
    var rows = [];
    files.forEach(file => {
      rows.push(
        this.createData(
          file.email,
          file.filename,
          file.description,
          file.uploadtime,
          file.updatedtime,
          <a target="_parent" href={file.url}>
            download
          </a>,
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.handleEditFile(file)}
          >
            Edit
          </Button>,
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.handleDeleteFile(file)}
          >
            Delete
          </Button>
        )
      );
    });
    return rows;
  };

  render() {
    const { classes } = this.props;

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
                  Hi {this.props.user.userInfo.firstName}!
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
          <Grid item xs={12} style={{ marginTop: 100 }}>
            <Paper className={classes.root}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Email</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>File name</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Description</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Upload time</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Updated time</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>download</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Edit time</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Delete File</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.files
                    ? this.renderFilesList(this.props.files).map(row => (
                        <TableRow key={row.email + row.filename}>
                          <TableCell component="th" scope="row">
                            {row.email}
                          </TableCell>
                          <TableCell align="right">{row.filename}</TableCell>
                          <TableCell align="right">{row.description}</TableCell>
                          <TableCell align="right">{row.uploadtime}</TableCell>
                          <TableCell align="right">{row.updatedtime}</TableCell>
                          <TableCell align="right">{row.download}</TableCell>
                          <TableCell align="right">{row.editfile}</TableCell>
                          <TableCell align="right">{row.deletefile}</TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      );
    } else {
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
