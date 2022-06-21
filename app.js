const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
port = 3000;
const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });
app.use(express.static(__dirname));


app.get('/', (req, res)=>{
    res.status(200).sendFile(__dirname+'/chatApp.html');
})


const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
})

const { Server } = require("socket.io");
const io = new Server(httpServer, { /* options */ });

const users = {};

io.on('connection', socket => {
    socket.emit('message', 'Hi there!');
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('new-user-joined', name => {
        socket.broadcast.emit('typing', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', {message: message.msg, name: users[socket.id], time: message.time});
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});


// httpServer.listen(3000, ()=>{
//     console.log("Chat Application is listening on http://localhost:3000");
// });