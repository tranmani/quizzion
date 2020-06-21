export default {
    namespaced: true,

    state: () => ({
        waitingRoom: {
            title: '',
            invitationCode: '',
            formHash: {}
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
        }
    }
}
