/*
Title : User Handler
*/

//  Dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

// Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && password && tosAgreement) {
    //  Make Sure that does alreafdy exists or not
    data.read("users", phone, (err1) => {
      if (err1) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        //  store the  user to db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created  successfully!",
            });
          } else {
            callback(500, {
              error: "Could not create user!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problenm in server side!",
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
handler._users.get = (requestProperties, callback) => {
  //  Check the phone number is valid or not
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    //  Lookup the user
    data.read("users", phone, (err, USR) => {
      const user = { ...parseJSON(USR) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "Requested user was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};

//  TODO  =>>>> Authentication
handler._users.put = (requestProperties, callback) => {
  //  Check the phone number is valid or not
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  // Validation
  if (phone) {
    if (firstName || lastName || password) {
      // Lokkup for the user
      data.read("users", phone, (err, usData) => {
        console.log(usData);
        const userData = { ...parseJSON(usData) };

        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          //  Update to  database
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                error: "User was updated successfully!",
              });
            } else {
              callback(500, {
                error: "There was a problem in the server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Your have a problem in your request!",
          });
        }
      });
    } else {
      callback(400, {
        error: "Your have a problem in your request!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number.  Please try again!",
    });
  }
};

//  TODO  =>>>> Authentication
handler._users.delete = (requestProperties, callback) => {
  //  Check the phone number is valid or not
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // Lookup the user
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, {
              message: "User was deleted successfully",
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
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
