const createPeerServerListener = (peerServer) => {
    peerServer.on('connection', (client) => {
        console.log("Successfully connected to the peer server");
    });
}

module.exports = {
    createPeerServerListener,
}