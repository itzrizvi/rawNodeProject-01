/*
Title : Token Handler
*/

//  Dependencies
const data = require("../../lib/data");
// const { hash } = require("../../helpers/utilities");
// const { parseJSON } = require("../../helpers/utilities");

// Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

//  TODO  =>>>> Authentication
handler._token.get = (requestProperties, callback) => {};

//  TODO  =>>>> Authentication
handler._token.put = (requestProperties, callback) => {};

//  TODO  =>>>> Authentication
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
