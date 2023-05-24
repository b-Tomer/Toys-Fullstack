import { userService } from '../services/user.service.js'
import { store } from './store.js'
import { SET_USER, SET_USER_ACTIVITIES } from './user.reducer.js'

export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
            return user
        })
        .catch(err => {
            console.error('Cannot login:', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
            return user
        })
        .catch(err => {
            console.error('Cannot signup:', err)
            throw err
        })
}

export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch(err => {
            console.error('Cannot logout:', err)
            throw err
        })
}

export function addActivity(activity) {
    return userService.addActivity(activity)
        .then((activities) => {
            store.dispatch({ type: SET_USER_ACTIVITIES, activities })
        })
        .catch(err => {
            console.error('Cannot logout:', err)
            throw err
        })
}

export function editUser(user) {
    // edit store user.
    return userService.editUser(user)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
}