import React, { Component } from "react";
import { connect } from "react-redux";
// import { FilePond, registerPlugin } from "react-filepond";
// import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
// import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// import "filepond/dist/filepond.min.css";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";

import { editFileAction, editFileDataBase } from "../actions/editFileAction";

// registerPlugin(
//   FilePondPluginFileValidateType,
//   FilePondPluginImageExifOrientation,
//   FilePondPluginImagePreview
// );

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300
  }
});

class EditFile extends Component {
  constructor() {
    super();
    this.state = {
      description: null,
      file: null,
      isSubmit: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.handleInit = this.handleInit.bind(this);
  }

  componentDidMount() {
    // console.log("edit file ");
    if (this.props.fileEdit) {
      //   console.log("edit file inside if");
      this.setState({ description: this.props.fileEdit.description });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const editData = {
      description: this.state.description,
      filename: this.props.fileEdit.filename,
      //   file: this.state.file[0],
      email: this.props.user.userInfo.email
    };
    this.setState({ isSubmit: true });
    this.props.editFileDataBase(editData, this.props.history);
    // this.props.history.push("/");
  }

  //   handleInit() {
  //     console.log("FilePond instance has initialised", this.pond);
  //   }

  render() {
    const { fileEdit } = this.props;
    console.log("fileEdit=", fileEdit);
    console.log("fileEdit state=", this.state.description);

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "30%"
        }}
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            paddingBottom: 4,
            paddingTop: 4,
            borderRadius: 4,
            marginTop: 15,
            backgroundImage:
              "linear-gradient(to right, #0c4b78, #3d4e96, #2c76a9)"
          }}
        >
          <h2>Edit Files</h2>
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column"
          }}
          onSubmit={this.onSubmit}
        >
          <TextField
            id="outlined-description"
            value={this.state.description}
            onChange={this.onChange}
            name="description"
            label="description"
            margin="normal"
            variant="outlined"
            multiline
          />

          {/* <FilePond
            ref={ref => (this.pond = ref)}
            files={this.state.file}
            allowMultiple={true}
            maxFiles={1}
            oninit={() => this.handleInit()}
            onupdatefiles={fileItems => {
              this.setState({
                file: fileItems.map(fileItem => fileItem.file)
              });
            }}
          /> */}
          <Button
            type="submit"
            variant="contained"
            color="default"
            style={{ marginTop: 10, marginBottom: 15 }}
          >
            Submit Edit
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fileEdit: state.fileEdit.fileEdit,
  user: state.user
});

export default connect(
  mapStateToProps,
  { editFileAction, editFileDataBase }
)(withStyles(styles, { withTheme: true })(EditFile));
