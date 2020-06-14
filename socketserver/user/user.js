class User {
    constructor(userHash, username, avatarUrl) {
        this.username = username;
        this.userHash = userHash;
        this.avatarUrl = avatarUrl;
    }
}

module.exports = User;