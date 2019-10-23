const config = require("./config/config");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
});

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});
var s3 = new AWS.S3({
  endpoint: "s3-eu-central-1.amazonaws.com",
  signatureVersion: "v4",
  region: "eu-central-1"
});

/**
 * createAccount
 *
 * Function for creating a new customer account.
 * First checks to ensure that the username does not already exist.
 * If the check passes, a new customer with the provided credentials is created.
 *
 * @api         post
 * @apiName     /users/newuser
 *
 * @apiParam    String        username
 * @apiParam    String        password
 * @apiParam    String        cust_name
 *
 * @apiSuccess    200   String    'User account created.'
 * @apiFailure    409   String    'Username already exists.'
 * @apiFailure    500   String    'Unable to connect to database.'
 * @apiFailure    500   String    'Unable to add user to database.'
 * */
const createAccount = (request, response) => {
  const searchUnique = "SELECT * FROM users WHERE email=$1";

  const searchValues = [`${request.body.email}`];

  pool.query(searchUnique, searchValues, (searchErr, searchRes) => {
    if (searchErr) {
      console.log(searchErr.stack);
      response.status(500).send("Unable to connect to database.");
    } else {
      if (searchRes.rowCount === 0) {
        const insertText =
          "INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4)";
        const insertValues = [
          `${request.body.email}`,
          `${request.body.firstName}`,
          `${request.body.lastName}`,
          `${request.body.password}`
        ];

        pool.query(insertText, insertValues, (insertErr, insertRes) => {
          if (insertErr) {
            console.log(insertErr.stack);
            response.status(500).send("Unable to add user to database.");
          } else {
            console.log("User account created.");
            response.status(200).send("User account created.");
          }
        });
      } else {
        console.log("Username already exists.");
        response.status(409).send("Username already exists.");
      }
    }
  });
};

const verifyuser = (request, response) => {
  // const email = request.body.email;
  // const password = request.body.password;
  // if (email === "adminpanel@gmail.com" && password === "adminminhphan172") {
  // } else {
  // }
  const queryGetUser =
    "SELECT email, firstname, lastname, password FROM users WHERE email=$1 AND password=$2 ";
  const queryGetUserValue = [
    `${request.body.email}`,
    `${request.body.password}`
  ];

  const queryGetUserFull =
    "SELECT email, firstname, lastname, password FROM users WHERE email=$1";
  const queryGetUserValueFull = [`${request.body.email}`];

  pool
    .query(queryGetUser, queryGetUserValue)
    .then(result => {
      if (result.rowCount === 1) {
        pool.query(queryGetUserFull, queryGetUserValueFull).then(result2 => {
          console.log(result2.rows);
          response.status(200).send(result2.rows[0]);
        });
        // response.status(200).send("user authenticated");
      } else {
        response.status(401).send("invalid email or password");
      }
    })
    .catch(err => {
      console.log(err);
      response.status(500).send("Unable to connect to database.");
    });
};

const uploadFile = (request, response) => {
  (async () => {
    var statusCode = 500;
    var message = "Unable to add file to database";
    const client = await pool.connect();
    // console.log("request.body*****", request.body);
    if (request.file) {
      // console.log(request.body.email);
      // console.log(request.file.originalname);
      // console.log(request.body.email + "/" + request.file.originalname);
      const bucketFileName =
        request.body.email + "/" + request.file.originalname;
      // console.log(bucketFileName);
      const params = {
        Bucket: config.Bucket,
        Body: request.file.buffer,
        Key: bucketFileName
      };
      // console.log(params.Key);
      try {
        const data = await s3.upload(params).promise();
        if (data) {
          console.log(
            "Cover uploaded successfully to location: " + data.Location
          );
          const insertFilesText =
            "INSERT INTO files (description, email, filename) VALUES ($1, $2, $3)";

          const insertFilesValues = [
            `${request.body.description}`,
            `${request.body.email}`,
            `${request.file.originalname}`
          ];

          await client.query(insertFilesText, insertFilesValues);
          message = "files meta data is uploaded";
          statusCode = 200;
        }
      } catch (e) {
        console.log("Error uploading file", e);
      }
    }
    response.status(statusCode).send(message);
  })().catch(e => {
    console.log("Unable to connect to database");
    response.status(500).send("Unable to connect to database");
  });
};

const getAllFiles = (request, response) => {
  (async () => {
    var statusCode = 500;
    var message = "Unable to connect to database";
    const client = await pool.connect();
    try {
      // Retrieve the files
      let file = [];
      let params = {
        Bucket: config.Bucket,
        Prefix: request.body.email
      };

      try {
        const listOfFiles = await s3.listObjectsV2(params).promise();
        for (let index = 0; index < listOfFiles["Contents"].length; index++) {
          const fileDirectory = listOfFiles["Contents"][index]["Key"];
          const expire = 60 * 60 * 60;
          const paramFile = {
            Bucket: config.Bucket,
            Key: fileDirectory,
            Expires: expire
          };
          const data = await s3.getSignedUrl(
            "getObject",
            paramFile,
            (err, url) => {
              if (err) {
                console.log(err);
              } else {
                file.push({ [fileDirectory.split("/")[1]]: url });
              }
            }
          );
        }
      } catch (e) {
        statusCode = 404;
        message = "Could not retrieve file from S3";
        throw new Error(message);
      }

      // Retrieve the description
      const filesTableQuery = "SELECT * FROM files WHERE email = $1";
      const filesTableQueryValue = [`${request.body.email}`];
      const filesTableQueryResult = await client.query(
        filesTableQuery,
        filesTableQueryValue
      );
      var fileInfoRows = filesTableQueryResult.rows;
      fileInfoRows.map(fileRow => {
        file.forEach(item => {
          if (Object.keys(item)[0] === fileRow.filename) {
            fileRow.url = item[Object.keys(item)[0]];
          }
        });
      });
      statusCode = 200;
    } catch (e) {
      console.log(e);
    } finally {
      response.status(statusCode).send(fileInfoRows);
    }
  })().catch(e => {
    console.log("Unable to connect to database");
    response.status(500).send("Unable to connect to database");
  });
};

const deleteFile = (request, response) => {
  (async () => {
    console.log(request.body);
    const client = await pool.connect();
    try {
      const deleteFileQuery =
        "DELETE FROM files WHERE email=$1 AND filename=$2";
      const deleteFileQueryText = [
        `${request.body.email}`,
        `${request.body.filename}`
      ];
      await client.query(deleteFileQuery, deleteFileQueryText);

      const params = {
        Bucket: config.Bucket,
        Key: request.body.email + "/" + request.body.filename
      };

      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log();
      });

      response.status(200).send("file is successfully deleted");
    } catch (e) {
      console.log(e);
    }
  })().catch(e => {
    console.log("Unable to connect to database");
    response.status(500).send("Unable to connect to database");
  });
};

const editFile = (request, response) => {
  (async () => {
    const client = await pool.connect();
    try {
      const updateFileQuery =
        "UPDATE files SET description=$1 WHERE filename=$2 AND email=$3";
      const updateFileQueryValues = [
        `${request.body.description}`,
        `${request.body.filename}`,
        `${request.body.email}`
      ];
      await client.query(updateFileQuery, updateFileQueryValues);

      response.status(200).send("file is updated");
    } catch (e) {
      console.log(e);
    }
  })().catch(e => {
    console.log("Unable to connect to database");
    response.status(500).send("Unable to connect to database");
  });
};

const loginWithFacebook = (request, response) => {
  const searchUnique = "SELECT * FROM users WHERE email=$1";

  const searchValues = [`${request.body.email}`];

  pool.query(searchUnique, searchValues, (searchErr, searchRes) => {
    if (searchErr) {
      console.log(searchErr.stack);
      response.status(500).send("Unable to connect to database.");
    } else {
      if (searchRes.rowCount === 0) {
        const insertText =
          "INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4)";
        const insertValues = [
          `${request.body.email}`,
          `${request.body.firstName}`,
          `${request.body.lastName}`,
          `${request.body.password}`
        ];

        pool.query(insertText, insertValues, (insertErr, insertRes) => {
          if (insertErr) {
            console.log(insertErr.stack);
            response.status(500).send("Unable to add user to database.");
          } else {
            console.log("Facebook User account created.");
            response.status(200).send("Facebook User account created.");
          }
        });
      } else {
        console.log("Username facebook already exists.");
        response.status(200).send("Username facebook already exists.");
      }
    }
  });
};

const adminGetAllFiles = (request, response) => {
  (async () => {
    const email = request.body.email;
    const password = request.body.password;
    console.log(email);
    console.log(password);

    if (email === "adminpanel@gmail.com" && password === "adminminhphan172") {
      const client = await pool.connect();
      try {
        //get all files from s3
        let file = [];
        let params = {
          Bucket: config.Bucket
        };

        // try {
        const listOfFiles = await s3.listObjectsV2(params).promise();
        // console.log("listOfFiles all-", listOfFiles["Contents"]);

        for (let index = 0; index < listOfFiles["Contents"].length; index++) {
          const fileDirectory = listOfFiles["Contents"][index]["Key"];
          const expire = 60 * 60 * 60;
          const paramFile = {
            Bucket: config.Bucket,
            Key: fileDirectory,
            Expires: expire
          };
          // const data = await s3.getSignedUrl(
          //   "getObject",
          //   paramFile,
          //   (err, url) => {
          //     if (err) {
          //       console.log(err);
          //     } else {
          //       // console.log('[fileDirectory.split("/")[1]]----', [
          //       //   fileDirectory.split("/")[1]
          //       // ]);
          //       // console.log("url---", url);
          //       file.push({ [fileDirectory.split("/")[1]]: url });
          //     }
          //   }
          // );
        }
        // console.log("file--1---", file);

        // } catch (e) {
        //   statusCode = 404;
        //   message = "Could not retrieve file from S3";
        //   throw new Error(message);
        // }
        // get files info
        const getAllFilesInfoQuery = "SELECT * FROM files";
        const getAllFilesInfoQueryResults = await client.query(
          getAllFilesInfoQuery
        );
        // console.log(
        //   "getAllFilesInfoQueryResults",
        //   getAllFilesInfoQueryResults.rows
        // );
        // console.log("file---2--", file);

        // combine file info and s3 urls
        var fileInfoRows = getAllFilesInfoQueryResults.rows;
        fileInfoRows.map(fileRow => {
          file.forEach(item => {
            // console.log("Object.keys(item)[0]-----", Object.keys(item)[0]);
            // console.log("fileRow.filename-----", fileRow.filename);

            if (Object.keys(item)[0] === fileRow.filename) {
              fileRow.url = item[Object.keys(item)[0]];
            }
          });
        });
        // console.log("file--3---", file);

        // console.log("fileInfoRows---", fileInfoRows);
        response.status(200).send(fileInfoRows);
      } catch (e) {
        console.log(e);
      }
    } else {
      response.status(401).send("invalid admin username or password");
    }
  })().catch(e => {
    console.log("Unable to connect to database");
    response.status(500).send("Unable to connect to database");
  });
};
module.exports = {
  createAccount,
  verifyuser,
  uploadFile,
  getAllFiles,
  deleteFile,
  editFile,
  loginWithFacebook,
  adminGetAllFiles
};
