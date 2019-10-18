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
    var fullFilesObject = [];
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

          // const paramFile = {
          //   Bucket: config.Bucket,
          //   Key: fileDirectory
          // };
          // const data = await s3.getObject(paramFile).promise();
          // if (data) {
          //   file.push({ [fileDirectory.split("/")[1]]: data.Body });
          // }
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
                console.log("=============");
                console.log(url);
                console.log("=============");

                file.push({ [fileDirectory.split("/")[1]]: url });
              }
            }
          );
          if (data) {
            console.log("getSignedUrl-", data);
            // file.push({ [fileDirectory.split("/")[1]]: data.Body });
          }
        }
      } catch (e) {
        statusCode = 404;
        message = "Could not retrieve file from S3";
        throw new Error(message);
      }
      // console.log(file);

      // Retrieve the description
      const filesTableQuery = "SELECT * FROM files WHERE email = $1";
      const filesTableQueryValue = [`${request.body.email}`];
      const filesTableQueryResult = await client.query(
        filesTableQuery,
        filesTableQueryValue
      );
      // console.log("filesTableQueryResult", filesTableQueryResult.rows);
      const fileInfoRows = filesTableQueryResult.rows;

      for (let i = 0; i < fileInfoRows.length; i++) {
        if (Object.keys(file[i])[0] === fileInfoRows[i].filename) {
          fullFilesObject.push({
            description: fileInfoRows[i].description,
            filename: fileInfoRows[i].filename,
            file: file[i][Object.keys(file[i])[0]]
          });
        }
      }
      statusCode = 200;

      // console.log("fullFilesObject-", fullFilesObject);
    } catch (e) {
      console.log(e);
    } finally {
      response.status(statusCode).send(fullFilesObject);
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
  getAllFiles
};
