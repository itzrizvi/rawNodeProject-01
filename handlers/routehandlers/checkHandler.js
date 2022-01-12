/*
Title : Check Handler
*/

//  Dependencies
const data = require("../../lib/data");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environment");

// Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

// Check POST API
handler._check.post = (requestProperties, callback) => {
  // Validate Inputs
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.url
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array > -1
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.successCodes
      : false;

  if (protocol && url && method && timeOutSeconds) {
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    // Lookup the user phone by reading the token
    data.read("tokens", token, (err, TKD) => {
      if (!err && TKD) {
        let userPhone = parseJSON(TKD).phone;
        // lookup the user data
        data.read("users", userPhone, (err, USRDT) => {
          if (!err && USRDT) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(USRDT);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                // maxChecks from  environment
                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };

                  // Save the object
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      //  Add  check  id to the users object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId); //--->>  couldn't got this

                      // Save the new user data
                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          // Return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User has already reach max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication Problem!",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication Problem!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// Check GET API
handler._check.get = (requestProperties, callback) => {};

//  TODO  =>>>> Authentication
handler._check.put = (requestProperties, callback) => {};

//  TODO  =>>>> Authentication
handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
