import AxiosClient from '../AxiosClient';

const endpoint = '/v51/template';

export default {
    postQuizTemplate(type, module, status, label, description, contenttype, templateContent, xcsrfToken) {
        return AxiosClient({
            method: 'post',
            url: `${endpoint}`,
            data: {
                type: type,
                module: module,
                status: status,
                label: label,
                description: description,
                contenttype: contenttype,
                content: JSON.stringify(templateContent)
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    putQuestionInQuizTemplate(contentType, templateNumber, templateQuestions, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${templateNumber}/content`,
            data: {
                contenttype: contentType,
                content: JSON.stringify(templateQuestions)
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getAllTemplates(xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getTemplate(templateHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${templateHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    getTemplateContent(templateHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${templateHash}/content`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateTemplate(templateHash, status, label, description, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${templateHash}`,
            data: {
                status: status,
                label: label,
                description: description
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateTemplateContent(templateNumber, contenttype, content, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${templateNumber}/content`,
            data: {
                contenttype: contenttype,
                content: JSON.stringify(content)
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        });
    },
    deleteTemplate(templateHash, xcsrfToken) {
        return AxiosClient({
            method: 'delete',
            url: `${endpoint}/${templateHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    }
};