import axios from 'axios'
import { Cookies } from 'quasar'

const baseURL = "https://backend.dev.parantion.nl/backend/api";
const access = "/v51/account/access";
const header = { headers: { 'X-Database': 'lab' } }

export default {
  namespaced: true,

  state: {
    token: Cookies.get('token'),
    user: {}
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      Cookies.set('token', token, { expires: "1h 59m 59s", sameSite: 'None' })
    },

    SET_USER(state, userProfile) {
      state.user = userProfile;
    },

    logout(state) {
      state.token = null
      state.user = null
      Cookies.remove('token')
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
