const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', socket => {
    
    socket.on('join', userid => {
        
       socket.broadcast.emit('user-connected', userid);
        
        socket.on('disconnect', () => {
            
            socket.broadcast.emit('user-desconnected', userid);
        
        });
    });
    
});

server.listen(3000);