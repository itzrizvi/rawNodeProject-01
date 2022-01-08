/*
Title : Utilities
*/

// module scaffolding
const crypto = require("crypto");
const utilities = {};
const environtments = require("./environment");

//  parse JSON string  to object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

//  HASHING STRING
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", environtments.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

//  Export Module
module.exports = utilities;
