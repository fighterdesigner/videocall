const socket = io('/');
const videoContainer = document.getElementById('video');
const myPeer = new Peer(undefined, {
   host: 'peerjs-server.herokuapp.com',
   secure:true
});

const peers = {};

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
   
    video: true,
    audio: true
    
}).then(stream => {
    
    addVideoStream(stream, myVideo);
    
        
        myPeer.on('call', call => {
            
           call.answer(stream); 
            
            const video = document.createElement('video');

            call.on('stream', userVideoStream => {
                addVideoStream(userVideoStream, video);
            });
            
        });
    
    
    socket.on('user-connected', userid => {
       newUserConnected(userid, stream); 
    });
    
    socket.on('user-desconnected', userid => {
       peers[userid].close(); 
    });
});

myPeer.on('open', id => {
socket.emit('join', id);    
});


function newUserConnected(userid, stream) {
    
    const call = myPeer.call(userid, stream);
    const video = document.createElement('video');
    
    call.on('stream', userVideoStream => {
        
        addVideoStream(userVideoStream, video);

    });
    
    call.on('close', () => {
        video.remove();
    });
    
    peers[userid] = call;
}

function addVideoStream(stream, video) {
    video.srcObject = stream;
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    
    videoContainer.append(video);
}