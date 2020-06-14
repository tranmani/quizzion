const UserAuthenticator = require('../user/user_authenticator.js')
const UserResponse = require('./responses/user_response.js');
const UserDataResponse = require('./responses/user_data_response.js');
const User = require('../user/user.js');
const AvatarProvider = require('../avatar/avatar_provider.js')
const UserInteractor = require('../user/user_interactor.js');

let self;

class RoomInteractor {
    constructor(io, room, moderator) {
        this.io = io;
        this.room = room;
        this.moderator = moderator;
        this.users = [];
        self = this;

        this.emitUsersInterval = setInterval(
            function () {
                self.emitUsers();
            }, 2000);
    }

    join(socket, code, { onSuccess, onError }) {
        if (this.room.code != code) {
            onError('Invalid invitation code');
            return;
        }

        UserAuthenticator.authenticate(this.room.formHash)
            .then((response) => {
                let data = response.data

                if (data == undefined) {
                    onError('Error while linking account');
                    return;
                }

                let userHash = data.user.uh;

                let user = new User(
                    userHash,
                    "Username1",
                    AvatarProvider.getAvatarUrl(userHash)
                );

                let userInteractor = new UserInteractor(user, socket, this.userCallback());

                this.users.push(userInteractor);

                // Connecting user to socket room
                socket.join(code);

                let userResponse = new UserResponse(
                    userHash,
                    "Username1",
                    data.token
                );

                onSuccess(userResponse);
            }).catch((error) => {
                onError(error.message);
            });
    }

    userCallback() {
        return {
            onUserDisconnected: (userHash) => {
                self.users = self.users.filter(value => value.user.userHash != userHash);
            }
        }
    }

    emitUsers() {
        let users = this.users.map(value => value.user);
        let response = new UserDataResponse({ users: users });

        this.io.to(this.room.code).emit(
            response.key,
            response.response
        );
    }

    cancelDataEmision() {
        clearInterval(this.emitUsersInterval);
    }
}

module.exports = RoomInteractor;