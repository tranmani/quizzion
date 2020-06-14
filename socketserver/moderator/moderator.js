class Moderator {
    constructor(userHash, socket, callback) {
        this.userHash = userHash;
        this.socket = socket;
        
        this.socket.on('disconnect', () => {
            callback(userHash);
        });
    }
}

module.exports = Moderator;