export function saveQuiz(state, payload) {
    state.quiz = Object.assign({}, state.quiz, payload)
}

export function saveStateQuestion(state, payload) {
    state.question = Object.assign({}, state.question, payload)
}

export function emptyQuizAndQuestions(state) {
    state.quiz = {}
    state.question = {}
}