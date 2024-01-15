// Create a connection to the peer server in backend
let myPeer;

export const connectWithMyPeer = () => {
    // undefined(first param) tells that peer server will create client ids for us on its own
    myPeer = new window.Peer( undefined, {
        path: '/peerjs',
        host: '/',
        port: '8000',
    } );

    myPeer.on('open', (id) => {
        console.log("Sucessfully connected to the peer server");
        console.log(id);
    });
}