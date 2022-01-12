/*
Title : Environment Variable File
*/

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "tujsxopwshdlszopastrez",
  maxChecks: 5, //  --> Added  for  further changing  time
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "jsxposdivopqpxskjawlsz",
  maxChecks: 5, //  --> Added  for  further changing  time
};

// determine which environemt have been passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//  Export  corresponding  env  obj
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
