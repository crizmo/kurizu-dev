const { Server } = require("socket.io")
const fs = require("fs")

let msgs = require("./msg.json") || [];
const io = new Server({
  cors: {
    origin: "*"
  }
})

io.on('connection', (socket) => {
  socket.emit('previous messages', require("./msg.json") || []);
  socket.on('chat message', (usr, pfp, msg) => {

    let data = [usr,pfp,msg];
    msgs.push(data);
    if (msgs.length == 11) msgs.splice(0, 1); 

    fs.writeFileSync('./msg.json', JSON.stringify(msgs), (err) => { 
      if (err) throw err;
    }); 

    io.emit('chat message', usr, pfp, msg);
  });

});

io.listen(3000);
console.log('listening on port 3000');