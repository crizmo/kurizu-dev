const { Server } = require("socket.io")
require("dotenv").config()

// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// mongoose.connect(process.env.mongodb);

// const userSchema = new Schema({
//   name: String,
//   pfp: String,
//   msg: String,
// });

let msgs = [];

const io = new Server({
  cors: {
    origin: "*"
  }
})

io.on('connection', (socket) => {
  socket.emit('previous messages', msgs)
  socket.on('chat message', (usr, pfp, msg) => {

    let data = [usr,pfp,msg]
    msgs.push(data);
    if (msgs.length == 11) msgs.splice(0, 1);

    io.emit('chat message', usr, pfp, msg);
  });

});

io.listen(3000);
console.log('listening on port 3000');