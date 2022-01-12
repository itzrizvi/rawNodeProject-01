/*
Title : All Routes
*/
// dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const { userHandler } = require("./handlers/routehandlers/userHandler");
const { tokenHandler } = require("./handlers/routehandlers/tokenHandler");
const { checkHandler } = require("./handlers/routehandlers/checkHandler");
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
