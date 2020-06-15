export function saveQuiz({ commit }, payload) {
    commit('saveQuiz', payload)
}

export function addQuestionToQuiz({ commit }, payload) {
    commit("addQuestionToQuiz", payload)
}

export function saveStateQuestion({ commit }, payload) {
    commit('saveStateQuestion', payload)
}

export function emptyQuizAndQuestions({ commit }) {
    commit('emptyQuizAndQuestions')
}