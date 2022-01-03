/*
Title : Uptime Monitoring App
*/

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
// App main
const app = {};

// config
app.config = {
  port: 5000,
};

// Cerate server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to PORT ${app.config.port}`);
  });
};

// handler request and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
