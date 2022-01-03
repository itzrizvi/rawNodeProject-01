/*
Title : Sample Handler
*/

// Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: "This is the sample URL",
  });
};

module.exports = handler;
