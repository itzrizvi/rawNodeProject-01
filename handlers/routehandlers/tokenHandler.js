/*
Title : Token Handler
*/

//  Dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

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
  //  Validation for users token
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

  //  Set Condition for generating  tokens
  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let tokenExpires = Date.now() + 60 * 60 * 1000;
        //  Token Object created
        let tokenObject = {
          phone,
          id: tokenId,
          tokenExpires,
        };

        //  Store Token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was problem in server",
            });
          }
        });
      } else {
        callback(400, {
          error: "Phone or Password is not valid",
        });
      }
    });
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
