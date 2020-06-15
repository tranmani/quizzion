export function updateQuiz({ commit }, payload) {
  commit('updateQuiz', payload)
}
export function addQuiz({ commit }, payload) {
  commit('addQuiz', payload)
}
export function deleteQuiz({ commit }, tn) {
  commit('deleteQuiz', tn)
}
export function emptyQuizzes({ commit }) {
  commit('emptyQuizzes')
}
export function setLoaded({ commit }, payload) {
  commit('setLoaded', payload)
}
export function setSortState({ commit }, payload) {
  commit('setSortState', payload)
}
export function emptyQuizzesForLogout({ commit }) {
  commit('logout')
}