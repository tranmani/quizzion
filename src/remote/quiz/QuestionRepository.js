import AxiosClient from '../AxiosClient';

const endpoint = '/v51/var';

export default {
    postQuestion(question, xcsrfToken) {
        console.log("QUESTION: ", question);
        return AxiosClient({
            method: 'post',
            url: `${endpoint}`,
            data: question,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getQuestion(varHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${varHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    deleteQuestion(varHash, xcsrfToken) {
        return AxiosClient({
            method: 'delete',
            url: `${endpoint}/${varHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateQuestion(question, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${question.vh}`,
            data: {
                label: question.label,
                position: question.position
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    }
};