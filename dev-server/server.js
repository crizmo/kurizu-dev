const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: "*"
  }
})

io.on('connection', (socket) => {
  socket.on('chat message', (usr, pfp, msg) => {
    io.emit('chat message', usr, pfp, msg);
  });

});

io.listen(3000);
console.log('listening on port 3000');