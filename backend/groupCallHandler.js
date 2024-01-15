const createPeerServerListener = (peerServer) => {
    peerServer.on('connection', (client) => {
        console.log("Successfully connected to the peer server");
        console.log("client.id", client.id);
    });
}

module.exports = {
    createPeerServerListener,
}