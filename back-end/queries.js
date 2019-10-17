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
// var s3 = new AWS.S3();

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

module.exports = {
  createAccount,
  verifyuser
};
