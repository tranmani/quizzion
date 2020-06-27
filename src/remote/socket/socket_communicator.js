import io from "socket.io-client";

// Before deploying change localhost url to https://3.212.180.89:3000/
const baseUrl = "https://3.212.180.89:3000/";
var self;

class SocketCommunicator {

    constructor(userHash) {
        if (userHash == undefined) {
            throw Error("User hash null in SocketCommunicator");
        }
        self = this;
        this.userHash = userHash;
        this.socket = this.initializeSocket();

        this.socket.on('connect', (response) => {
            console.log("SocketCommunicator: connect response ");
        });

        this.socket.on('reconnect_response', (response) => {
            console.log("SocketCommunicator: reconnect response ", response);
        });

        this.socket.on('disconnect', (response) => {
            console.log("SocketCommunicator: disconnect response ", response);
        });
    }

    initializeSocket() {
        if (self.socket != undefined) {
            return self.socket;
        }
        const newSocket = io(baseUrl, {
            transport: ['websocket'],
            query: {
                token: this.userHash
            }
        });
        newSocket.emit("reconnect_request", {});
        return newSocket;
    }

    on(path, response) {
        if (self.socket == undefined) {
            return;
        }
        self.socket.on(path, response);
    }

    emit(path, request) {
        if (self.socket == undefined) {
            return;
        }
        self.socket.emit(path, request);
    }
}

export default SocketCommunicator;