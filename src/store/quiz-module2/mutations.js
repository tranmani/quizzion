export function saveQuiz(state, payload) {
    state.quiz = Object.assign({}, state.quiz, payload)
}

export function addQuestionToQuiz(state, payload) {
    state.quiz.questions = payload
    console.log(state.quiz);
}

export function saveStateQuestion(state, payload) {
    state.question = Object.assign({}, state.question, payload)
    console.log("NEW QUESTION: ", state.question);
}

export function emptyQuizAndQuestions(state) {
    state.quiz = {}
    state.question = {}
}