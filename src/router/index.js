import Vue from 'vue'
import VueRouter from 'vue-router'
import VueDraggable from "vue-draggable";
import Store from "../store/authLogin"

import routes from './routes'

Vue.use(VueRouter)
Vue.use(VueDraggable);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const Router = new VueRouter({
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

Router.beforeEach((to, from, next) => {
  let currentUser = false // cannot get currentUser of undefined
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if(Store.state.token != null){
    currentUser = true
  }

  if (requiresAuth && !currentUser) {
    next('signin')
  } else if (!requiresAuth && currentUser) {
    next('dashboard')
  } else next()
})

export default function ( /* { store, ssrContext } */ ) {
  return Router
}
