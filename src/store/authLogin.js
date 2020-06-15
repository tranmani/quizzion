import axios from 'axios'

const baseURL = "https://backend.dev.parantion.nl/backend/api";
const access = "/v51/account/access";
const header = {headers: { 'X-Database': 'lab'}}

export default {
  namespaced: true,

  state: {
    token: window.sessionStorage.getItem('token'),
    user: {}//window.sessionStorage.getItem('user')
  },

  mutations: {
    SET_TOKEN (state, token){
      state.token = token
      window.sessionStorage.setItem('token', token)
    },

    SET_USER(state, userProfile) {
      state.user = userProfile;
      window.sessionStorage.setItem('user', userProfile)
    },

    logout(state) {
      state.token = null
      state.user = null
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('user')
    }
  },

  actions: {
    async signIn({
      dispatch
    }, credentials) {
      let response = await axios.post(baseURL + access, credentials, header)
      dispatch('attemptToken', response.data.token)
      dispatch('attemptUser', response.data.user)
    },

    attemptToken({
      commit
    }, token) {
      commit('SET_TOKEN', token)
    },
    attemptUser({
      commit
    }, userProfile) {
      commit('SET_USER', userProfile)
    },
    logout({ commit }) {
      commit('logout')
    }
  },

  getters: {
    user(state) {
      return state.user
    },
    token(state) {
      return state.token
    }
  }
}
