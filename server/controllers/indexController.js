const connexion = require("../models/db");
const test = function (req, res, next) {
  res.send(connexion.showAllSchemas());
};

module.exports = { test };
