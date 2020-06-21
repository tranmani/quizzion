import Vue from 'vue'
import Vuex from 'vuex'
import SingleQuizModule from './quiz-module2'

import authLogin from './authLogin'
import quizzes from './dashboard-module'
import waitingRoom from './waitingroom-module/waitingRoom'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function ( /* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {},
    mutations: {},
    modules: {
      quizzes,
      authLogin,
      quiz: {},
      SingleQuizModule,
      waitingRoom
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
