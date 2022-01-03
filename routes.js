/*
Title : All Routes
*/
// dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const routes = {
  sample: sampleHandler,
};

module.exports = routes;
