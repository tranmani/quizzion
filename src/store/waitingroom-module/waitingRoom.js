export default {
    namespaced: true,

    state: () => ({
        waitingRoom: {
            title: '',
            invitationCode: '',
            formHash: {},
            thumbnailUrl: '',
            userHash: '',
            username: '',
            avatarUrl: ''
        }
    }),

    mutations: {
        title(state, title) {
            state.waitingRoom.title = title;
        },

        invitationCode(state, invitationCode) {
            state.waitingRoom.invitationCode = invitationCode;
        },

        formHash(state, formHash) {
            state.waitingRoom.formHash = formHash;
        },
        thumbnailUrl(state, thumbnailUrl) {
            state.waitingRoom.thumbnailUrl = thumbnailUrl;
        },
        userHash(state, userHash) {
            state.waitingRoom.userHash = userHash;
        },

        username(state, username) {
            state.waitingRoom.username = username;
        },

        avatarUrl(state, avatarUrl) {
            state.waitingRoom.avatarUrl = avatarUrl;
        }
    },

    actions: {
        setTitle({ commit }, title) {
            commit('title', title);
        },

        setInvitationCode({ commit }, invitationCode) {
            commit('invitationCode', invitationCode);
        },

        setFormHash({ commit }, formHash) {
            commit('formHash', formHash);
        },

        setThumbnailUrl({ commit }, thumbnailUrl) {
            commit('thumbnailUrl', thumbnailUrl);
        },
        setUserHash({ commit }, userHash) {
            commit('userHash', userHash);
        },

        setUsername({ commit }, username) {
            commit('username', username);
        },

        setAvatarUrl({ commit }, avatarUrl) {
            commit('avatarUrl', avatarUrl);
        }
    },

    getters: {
        getTitle(state) {
            return state.waitingRoom.title;
        },

        getInvitationCode(state) {
            return state.waitingRoom.invitationCode;
        },

        getFormHash(state) {
            return state.waitingRoom.formHash;
        },

        getThumbnailUrl(state) {
            return state.waitingRoom.thumbnailUrl;
        },
        getUserHash(state) {
            return state.waitingRoom.userHash.userHash;
        },

        getUsername(state) {
            return state.waitingRoom.username.username;
        },

        getAvatarUrl(state) {
            return state.waitingRoom.avatarUrl.avatarUrl;
        }
    }
}
