import axios from 'axios'
import { asyncStorageService } from './async-storage.service.js'
import { httpService } from './http.service.js'

const STORAGE_KEY = 'userDB'
const BASE_URL = 'auth/'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getById,
    getLoggedinUser,
    getEmptyCredentials,
    editUser
}

window.us = userService

function getById(userId) {
    return httpService.get(BASE_URL + userId)
}

async function login({ username, password }) {
    try {
        const user = await httpService.post(BASE_URL + 'login', { username, password })
        if (user) return _setLoggedinUser(user)
    } catch (err) {
        console.log('err: ', err)
    }
}

// function login({ username, password }) {
//     return storageService.query(STORAGE_KEY)
//         .then(users => {
//             const user = users.find(user => user.username === username)
//             if (user) return _setLoggedinUser(user)
//             else return Promise.reject('Invalid login')
//         })
// }

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, score: 10000 }
    return httpService.post(BASE_URL + 'signup', user)
        .then(_setLoggedinUser)
}

// function updateScore(diff) {
//     return userService.getById(getLoggedinUser()._id)
//         .then(user => {
//             if (user.score + diff < 0) return Promise.reject('No credit')
//             user.score += diff
//             return storageService.put(STORAGE_KEY, user)
//                 .then((user) => {
//                     _setLoggedinUser(user)
//                     return user.score
//                 })
//         })
// }

async function logout() {
    try {
        await httpService.post(BASE_URL + 'logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    }
    catch(err){
        console.log('err: ', err )
    }
}

function editUser(newName) {
    return userService.getById(getLoggedinUser()._id)
        .then(user => {
            if (!user._id) return Promise.reject('Not logged in')
            user.fullname = newName
            console.log('user: ', user)
            return httpService.put(BASE_URL + 'edit', user)
                .then((user) => {
                    _setLoggedinUser(user)
                })
        })
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

// Test Data
// userService.signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// userService.login({username: 'muki', password: 'muki1'})

