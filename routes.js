/*
Title : All Routes
*/
// dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const { userHandler } = require("./handlers/routehandlers/userHandler");
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
