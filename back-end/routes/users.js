var express = require("express");
var router = express.Router();
const db = require("../queries");
var multer = require("multer");
var upload = multer();

router.post("/newuser", db.createAccount);
router.post("/verifyuser", db.verifyuser);

module.exports = router;
