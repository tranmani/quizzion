const baseURL = "http://localhost:3000/avatar/72";

module.exports = {
    getAvatarUrl(id) {
        return `${baseURL}/${id}`;
    }
}