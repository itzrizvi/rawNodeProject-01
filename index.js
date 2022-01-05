/*
Title : Uptime Monitoring App
*/

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environment");
// App main
const app = {};

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
