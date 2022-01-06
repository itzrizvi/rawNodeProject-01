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

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

//  Update Existing file
lib.update = (dir, file, data, callback) => {
  // File Open for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      //  truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close  the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing file!");
                }
              });
            } else {
              callback("Error  writing to file!");
            }
          });
        } else {
          console.log("Error truncating file!");
        }
      });
    } else {
      console.log(`Error updating. File may not exists!!`);
    }
  });
};

// Delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Error deleting file`);
    }
  });
};

module.exports = lib;
