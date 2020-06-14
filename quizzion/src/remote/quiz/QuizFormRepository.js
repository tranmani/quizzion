import AxiosClient from '../AxiosClient';

const endpoint = '/v51/form';

export default {
    postQuizForm(label, type, templateNumber, xcsrfToken) {
        console.log("ddd:",templateNumber)
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
    }
};