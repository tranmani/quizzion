import AxiosClient from './AxiosClient';

Vue.prototype.$http = AxiosClient;

AxiosClient.interceptors.response.use(
    response => {
        if(response.status === 200 || response.status === 201) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if(error.response.statues) {
            switch(error.response.status) {
                case 401:
                    router.replace({
                        path: "/login",
                        query: {
                          redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
            }
        }
    }
)