import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import { Typography, Toolbar } from "@material-ui/core";
import { Home, AccountCircle, ShoppingCart } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { logoutAction } from "../actions/signUpSignIn";

const styles = {
  root: {
    color: "white"
  }
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    this.props.logoutAction();
  };

  render() {
    const { classes } = this.props;
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
                <Link to="/">
                  <IconButton aria-haspopup="true">
                    <Home classes={{ root: classes.root }} />
                  </IconButton>
                </Link>
                <Link
                  onClick={this.handleLogout}
                  style={{ color: "white" }}
                  to="/signin"
                >
                  Log out
                </Link>
              </Toolbar>
            </AppBar>
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
  user: state.user
});

export default connect(
  mapStateToProps,
  { logoutAction }
)(withRouter(withStyles(styles)(LandingPage)));
