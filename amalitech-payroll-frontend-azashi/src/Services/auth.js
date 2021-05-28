import Api from '../Services/api'
import axios from 'axios'
import * as Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import moment from "moment"

const AUTH_TOKEN_KEY = 'authToken'
const CURRENT_USER = 'currentUser'

export function loginUser (userData) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const res = await Api().post('/auth/signin', userData)
            if (res.data) {
                setAuthToken(res.data.token)
                setCurrentUser(res.data)
                resolve(res)
            } else {
                reject(res)
            }
        } catch (error) {
            reject(error)
        }
    })
}
 export function logoutUser () { clearAuthToken(); clearCurrentUser() }

export function setAuthToken (token) {
    Cookies.set(AUTH_TOKEN_KEY, token)
}


export function getAuthToken () {
    return Cookies.get(AUTH_TOKEN_KEY)
}

export function clearAuthToken () {
    axios.defaults.headers.common.Authorization = ''
    return Cookies.remove(AUTH_TOKEN_KEY)
}

export function isLoggedIn () {
    const authToken = getAuthToken()
    return !!(authToken && isTokenActive(authToken))
}
export function setCurrentUser (data) {
    Cookies.set(CURRENT_USER, JSON.stringify(data))
}
export function getCurrentUser () {
    return JSON.parse(Cookies.get(CURRENT_USER))
}
export function clearCurrentUser () {
    return Cookies.remove(CURRENT_USER)
}
export function isSuperUser () {
   return (isLoggedIn())
}
export function getUserRole () {
    if(isLoggedIn()) {
        return getCurrentUser().role
    } else {return []}
}

 function getTokenExpirationDate (encodedToken) {
  const token = jwt_decode(encodedToken)
  if (!token.exp) {
    return null
  }
  return token.exp
}
export function isTokenActive (token) {
  const expirationDate = getTokenExpirationDate(token)
    const now = Math.floor(Date.now() / 1000)
  return (expirationDate > now)
}
