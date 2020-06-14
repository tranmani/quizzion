export function getQuiz(state) {
    let quiz = {}
    console.log("quiz: ", state.quiz);
    Object.assign(quiz, state.quiz)
    return quiz
}

export function getQuestion(state) {
    let question = {};
    Object.assign(question, state.question);
    return question;
}