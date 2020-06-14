import AxiosClient from '../AxiosClient';

const endpoint = '/v51/user';

export default {
    getUser(id, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/${id}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    updateUser(id, user, xcsrfToken) {
        return AxiosClient({
            method: 'put',
            url: `${endpoint}/${id}/field?field[email]=${user.email}&field[firstname]=${user.firstname}&field[lastname]=${user.lastname}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    }
};