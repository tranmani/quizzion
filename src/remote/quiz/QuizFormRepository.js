import AxiosClient from '../AxiosClient';

const endpoint = '/v51/form';

export default {
    postQuizForm(label, type, templateNumber, xcsrfToken) {
        return AxiosClient({
            method: 'post',
            url: `${endpoint}`,
            data: {
                frm_label: label,
                type: type,
                tn: templateNumber
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getAllQuizForms(xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getQuizForm(formHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${formHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateQuizForm(formHash, label, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${formHash}`,
            body: {
                frm_label: label
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    deleteQuizForm(formHash, xcsrfToken) {
        return AxiosClient({
            method: 'delete',
            url: `${endpoint}/${formHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getQuizFormBulkData(formHash, questionName, userXCSRFToken) {
        console.log("ASDSADASDASDASDASDSADASD!!@!@!@!@!", questionName)
        return AxiosClient({
            method: 'get',
            url: `/v51/data/bulk?vars[]=sur_serial&vars[]=frm_progress&vars[]=email&vars[]=frm_date&vars[]=${questionName}&forms=${formHash}`,
            headers: { 'X-CSRFToken': userXCSRFToken }
        })
    },
    submitAnswer(questionName, answerName, userXCSRFToken) {
        let varsInit = {}
        varsInit[questionName] = answerName
        return AxiosClient({
            method: 'put',
            url: `/v51/data`,
            body: {
                vars: varsInit
            },
            headers: { 'X-CSRFToken': userXCSRFToken }
        })
    }
};