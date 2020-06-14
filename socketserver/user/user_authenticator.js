const AxiosClient = require('../remote/axios_client.js');
const endpoint = '/v51/account/link'

module.exports = {
    authenticate(formHash) {
        return AxiosClient({
            method: 'post',
            url: endpoint,
            data: {
                'parameter': {
                    'form': formHash
                }
            }
        });
    }
};