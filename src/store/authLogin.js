import axios from 'axios'

const baseURL = "https://backend.dev.parantion.nl/backend/api";
const access = "/v51/account/access";
const header = { headers: { 'X-Database': 'lab' } }

export default {
  namespaced: true,

  state: {
    token: window.sessionStorage.getItem('token'),
    userHash: window.sessionStorage.getItem('userHash'),
    userObject: {},
    avatar: window.sessionStorage.getItem('avatar')
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      window.sessionStorage.setItem('token', token)
    },

    SET_USER(state, userHash) {
      state.userHash = userHash;
      window.sessionStorage.setItem('userHash', userHash)
    },

    SET_USER_OBJECT(state, userObject) {
      state.userObject = userObject;
    },

    SET_AVATAR(state, avatar) {
      state.avatar = avatar;
      window.sessionStorage.setItem('avatar', avatar)
    },

    logout(state) {
      state.token = null
      state.userHash = null
      state.userObject = null
      state.avatar = null
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('userHash')
      window.sessionStorage.removeItem('avatar')
    }
  },

  actions: {
    async signIn({
      dispatch
    }, credentials) {
      let response = await axios.post(baseURL + access, credentials, header)
      dispatch('attemptToken', response.data.token)
      dispatch('attemptUser', response.data.user.uh)
      dispatch('attemptUserObject', response.data.user)
    },

    attemptToken({
      commit
    }, token) {
      commit('SET_TOKEN', token)
    },
    attemptUser({
      commit
    }, userHash) {
      commit('SET_USER', userHash)
    },
    attemptUserObject({
      commit
    }, userObject) {
      commit('SET_USER_OBJECT', userObject)
    },
    attemptAvatar({ commit }, avatar) {
      commit('SET_AVATAR', avatar)
    },
    logout({ commit }) {
      commit('logout')
    }
  },

  getters: {
    userObject(state) {
      return state.userObject
    },
    userHash(state) {
      return state.userHash
    },
    token(state) {
      return state.token
    },
    avatar(state) {
      return state.avatar
    }
  }
}
