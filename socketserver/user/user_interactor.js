var self;

class UserInteractor {
    constructor(user, socket, callback) {
        this.user = user;
        this.socket = socket;
        this.callback = callback;
        self = this;

        this.socket.on('disconnect', () => { 
            callback.onUserDisconnected(this.user.userHash);
        });
    }
}

module.exports = UserInteractor;