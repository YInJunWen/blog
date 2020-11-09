import axios from 'axios';

export function getAllList(data) {
    return axios({
        url: '/getAllList',
    });
}
