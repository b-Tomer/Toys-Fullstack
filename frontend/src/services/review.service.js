import { asyncStorageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service.js'


const STORAGE_KEY = 'reviewDB'
const BASE_URL = 'review/'

export const reviewService = {
    query,
    getById,
    save,
    remove,
    getEmptyReview,
    getDefaultFilter
}


function query(filterBy = {}) {
    // return asyncStorageService.query(STORAGE_KEY)
    return httpService.get(BASE_URL, { filterBy })
}
function getById(reviewId) {
    return httpService.get(BASE_URL + reviewId)
    // return asyncStorageService.get(STORAGE_KEY, reviewId)
}
function remove(reviewId) {
    // return asyncStorageService.remove(STORAGE_KEY, reviewId)
    // return Promise.reject('Not now!')
    return httpService.delete(BASE_URL + reviewId)
}
function save(review) {
    // const method = review._id ? 'put' : 'post'
    // return asyncStorageService[method](STORAGE_KEY, review)
    if (review._id) {
        console.log('review: ', review)
        return httpService.put(BASE_URL, review)
    } else {
        return httpService.post(BASE_URL, review)
    }
}

function getDefaultFilter() {
    return { search: '', inStock: false, labels: [] }
}

function getEmptyReview() {
    return {
        txt: '',
        user: '',
        toy: {}
    }
}
