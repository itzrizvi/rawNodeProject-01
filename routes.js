/*
Title : All Routes
*/
// dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const { userHandler } = require("./handlers/routehandlers/userHandler");
const { tokenHandler } = require("./handlers/routehandlers/tokenHandler");
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
