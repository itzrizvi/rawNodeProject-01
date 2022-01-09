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

//  CREATE RANDOM STRING
utilities.createRandomString = (strLength) => {
  let lengthStr = strLength;
  lengthStr =
    typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (lengthStr) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let outputChars = "";
    for (let i = 1; i < strLength; i += 1) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      outputChars += randomCharacter;
    }

    return outputChars;
  } else {
    return false;
  }
};

//  Export Module
module.exports = utilities;
