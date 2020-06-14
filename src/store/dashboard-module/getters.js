export function quizzes(state) {
  return [...state.quizzes]
}
export function dashboardLoaded(state) {
  return state.dashboardLoaded
}
export function sortState(state) {
  return state.sortState
}
export function availableTn(state) {
  let allTn = []
  state.quizzes.forEach(element => {
    allTn.push(element.tn)
  });
  return allTn
}