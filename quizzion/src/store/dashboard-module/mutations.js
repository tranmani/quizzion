export function updateQuiz(state, payload) {
  state.quizzes.forEach(element => {
    if (element.tn == payload.tn) {
      Object.assign(element, payload)
    }
  });
}
export function addQuiz(state, payload) {
  state.quizzes.push(payload)
}
export function deleteQuiz(state, id) {
  let index = state.quizzes.findIndex((obj => obj.id == id))
  state.quizzes.splice(index, 1)
}
export function emptyQuizzes(state) {
  state.dashboardLoaded = false
  state.quizzes = []
}
export function setLoaded(state) {
  state.dashboardLoaded = true
}
export function setSortState(state, payload) {
  state.sortState = payload
}
export function logout(state) {
  state.dashboardLoaded = false
  state.quizzes = []
  state.sortState = null
}