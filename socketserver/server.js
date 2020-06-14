const app = require("express")();
const avatarMiddleware = require("adorable-avatars");
const ServerCommunicator = require('./server/server_communicator.js');
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const serverCommunicator = new ServerCommunicator(io);
app.use('/avatar', avatarMiddleware);

server.listen(3000, () => {
  console.log(
    `Server is running on address ${server.address().address} and port ${server.address().port}`
  );
});

module.exports = app;