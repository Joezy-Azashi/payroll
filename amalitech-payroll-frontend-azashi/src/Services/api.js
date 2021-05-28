import axios from 'axios'
import * as Cookies from 'js-cookie'
import config from '../public/config'

export default () => {
    const authToken = Cookies.get('authToken')
    return axios.create({
        baseURL: config.api,
        withCredentials: false,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : null
        }
    })
}


