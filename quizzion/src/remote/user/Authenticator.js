import AxiosClient from '../AxiosClient';

const endpoint = '/v51/account';

export default {
    login(username, password) {
        return AxiosClient({
            method: 'post',
            url: `${endpoint}/access`,
            data: { username: username, password: password }
        });
    },
    getUserByToken(xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${endpoint}/user`,
            headers: { 'X-CSRFToken': xcsrfToken }
        })
    },
    linkUserAccountToForm(form_hash) {
        return AxiosClient({
            method: 'post',
            url: `${endpoint}/link`,
            data: {
                'parameter': {
                    'form': form_hash
                }
            }
        })
    }
};
