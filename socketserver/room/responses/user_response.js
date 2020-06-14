class UserResponse {
    constructor(userHash, username, accessToken) {
        this.userHash = userHash;
        this.username = username;
        this.accessToken = accessToken;
    }
}

module.exports = UserResponse;