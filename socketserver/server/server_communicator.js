const Room = require("../room/room.js");
const Moderator = require("../moderator/moderator.js");
const RoomInteractor = require("../room/room_interactor.js");
const JoinRoomResponse = require("./responses/join_room_response.js");
const CreateRoomResponse = require("./responses/create_room_response.js");

var rooms = [];

class ServerCommunicator {
    constructor(io) {
        io.on('connection', function onConnect(socket) {
            socket.on('createRoomRequest', (request) => {
                createRoom(io, socket, request);
            });

            socket.on('joinRoomRequest', (request) => {
                joinRoom(socket, request);
            });

            // Client error handling
            socket.on('error', onError);
            socket.on('disconnect', onDisconnect);
        });
    }
}

function createRoom(io, socket, request) {
    
    if (request == undefined) {
        let response = new CreateRoomResponse({ error: 'Invalid request' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    if (request.userHash == undefined) {
        let response = new CreateRoomResponse({ error: 'Invalid user hash' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    if (request.formHash == undefined) {
        let response = new CreateRoomResponse({ error: 'Invalid form number' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    let activeRoom = rooms.find(element => element.moderator.userHash == request.userHash);

    if (activeRoom != undefined) {
        let response = new CreateRoomResponse({ error: "Can't create second room (not allowed)" });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    let code = Math.random().toString(36).substring(2);
    let room = new Room(code, request.formHash);

    let moderator = new Moderator(request.userHash, socket, onModeratorDisconnected);

    //Moderator creates and joins socket room
    socket.join(code);

    let roomInteractor = new RoomInteractor(io, room, moderator);

    rooms.push(roomInteractor);

    let response = new CreateRoomResponse({ code: code });
    socket.emit(
        response.key,
        response.response
    );
}

function joinRoom(socket, request) {
    if (request == undefined) {
        let response = new JoinRoomResponse({ error: 'Invalid request' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    if (request.code == undefined) {
        let response = new JoinRoomResponse({ error: 'Missing code' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    let roomInteractor = rooms.find(value => value.room.code == request.code);

    if (roomInteractor == undefined) {
        let response = new JoinRoomResponse({ error: 'Invalid invitation code or quiz no longer active' });
        socket.emit(
            response.key,
            response.response
        );
        return;
    }

    roomInteractor.join(
        socket,
        request.code,
        {
            onSuccess: (user) => {
                let response = new JoinRoomResponse({ user: user });
                socket.emit(
                    response.key,
                    response.response
                );
            },
            onError: (error) => {
                let response = new JoinRoomResponse({ error: error });
                socket.emit(
                    response.key,
                    response.response
                );
            }
        }
    );
}

function onModeratorDisconnected(userHash) {
    roomInteractor = rooms.find(value => value.moderator.userHash == userHash);
    if (roomInteractor != undefined) {
        roomInteractor.cancelDataEmision();
    }

    rooms = rooms.filter(value => value.moderator.userHash != userHash);
}

function onError(error) {
    console.log(`Socket server error ${error}`);
}

function onDisconnect(reason) {
    console.log(`Disconnected from socket server with reason: ${reason}`);
}

module.exports = ServerCommunicator;