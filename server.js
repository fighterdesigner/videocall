const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');

const port = process.env.PORT || 3000;

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});
 
app.use('/peerjs', peerServer);


app.use(express.static('public'));

io.on('connection', socket => {
    
    socket.on('join', userid => {
        
       socket.broadcast.emit('user-connected', userid);
        
        socket.on('disconnect', () => {
            
            socket.broadcast.emit('user-desconnected', userid);
        
        });
    });
    
});

server.listen(port);