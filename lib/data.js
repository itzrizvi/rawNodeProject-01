//  Data library

// dependencies
const fs = require("fs");
const path = require("path");

//  Module  Scaffolding
const lib = {};

//  base directory
lib.basedir = path.join(__dirname, "../.data/");

// write data  to file
lib.create = function (dir, file, data, callback) {
  // Open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert  data  to string
      const stringData = JSON.stringify(data);

      //  write data to file and then  close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error Closing the new file");
            }
          });
        } else {
          callback("Error writing to new file!");
        }
      });
    } else {
      callback("Could not create new file, it may already exists!");
    }
  });
};

module.exports = lib;
