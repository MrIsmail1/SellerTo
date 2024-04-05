const express = require("express");
const { test } = require("../controllers/indexController");
const router = express.Router();

/* GET home page. */
router.get("/", test);

module.exports = router;
