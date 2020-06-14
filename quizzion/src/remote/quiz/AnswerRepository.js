import AxiosClient from '../AxiosClient';

const endpoint = '/v51/varoption';

export default {
    postAnswerGroup(label, multiple, xcsrfToken) {
        return AxiosClient({
            method: 'post',
            url: `${endpoint}`,
            data: {
                label: label,
                multiple: multiple
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getAnswerGroup(var_option_group_hash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${var_option_group_hash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getAnswerGroupAnswers(varOptionGroupHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${varOptionGroupHash}/option`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    deleteAnswerGroup(varOptionGroupHash, xcsrfToken) {
        return AxiosClient({
            method: 'delete',
            url: `${endpoint}/${varOptionGroupHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateAnswerGroup(label, varOptionGroupHash, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${varOptionGroupHash}`,
            data: {
                label: label
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    postAnswer(answerToAdd, varOptionGroupHash, xcsrfToken) {

        return AxiosClient({
            method: 'post',
            url: `${endpoint}/${varOptionGroupHash}`,
            data: {
                label: answerToAdd.label,
                value: answerToAdd.value,
                position: answerToAdd.position
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getAnswer(varOptionGroupHash, varOptionName, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${varOptionGroupHash}/option/${varOptionName}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    deleteAnswer(varOptionGroupHash, varOptionName, xcsrfToken) {
        return AxiosClient({
            method: 'delete',
            url: `${endpoint}/${varOptionGroupHash}/option/${varOptionName}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateAnswer(answer, varOptionGroupHash, xcsrfToken) {

        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${varOptionGroupHash}/option/${answer.name}`,
            data: {
                label: answer.label,
                value: answer.value,
                position: answer.position
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
};