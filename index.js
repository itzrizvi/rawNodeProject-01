/*
Title : Uptime Monitoring App
*/

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environment");
const data = require("./lib/data");
// App main
const app = {};

// Testing File System Starts---> ###

// data.create(
//   "test",
//   "newFile",
//   { name: "Bangladesh", lang: "Bangla" },
//   (err) => {
//     console.log(`Error was ${err}`);
//   }
// );

// data.read("test", "newFile", (err, data) => {
//   console.log(err, data);
// });

// data.update("test", "newFile", { name: "England", lang: "English" }, (err) => {
//   console.log(err);
// });

// data.delete("test", "newFile", (err) => {
//   console.log(err);
// });

// Testing File System Ends  ---> ###

// Cerate server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to PORT ${environment.port}`);
  });
};

// handler request and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
