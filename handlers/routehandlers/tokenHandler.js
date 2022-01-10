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

//  Token  POST  API
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
//  Token GET API
handler._token.get = (requestProperties, callback) => {
  //  Check the tokenId is valid or not
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //  Lookup the token
    data.read("tokens", id, (err, TKD) => {
      const token = { ...parseJSON(TKD) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested tokens was not found!",
    });
  }
};

//  Token PUT API
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 19
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, TKD) => {
      let tokenObject = parseJSON(TKD);
      if (tokenObject.tokenExpires > Date.now()) {
        tokenObject.tokenExpires = Date.now() + 60 * 60 * 1000;
        // Store The  Updated Data  here
        data.update("tokens", id, tokenObject, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(400, {
          error: "This token  is already expired!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in  your request!",
    });
  }
};

//  Token Delete API
handler._token.delete = (requestProperties, callback) => {
  //  Check the token is valid or not
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // Lookup the user
    data.read("tokens", id, (err, TKD) => {
      if (!err && TKD) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token was deleted successfully",
            });
          } else {
            callback(500, {
              error: "There was a server side error!!",
            });
          }
        });
      } else {
        callback(400, {
          error: "There was a server side error!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in  your reguest!!!",
    });
  }
};

module.exports = handler;
