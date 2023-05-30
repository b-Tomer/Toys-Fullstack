import { toyService } from "../services/toy.service.js"
import { store } from './store.js'
import { ADD_TOY, REMOVE_TOY, SET_TOYS, SET_IS_LOADING, UPDATE_TOY } from './toy.reducer.js'



export async function loadToys(filterBy, sortBy) {
    // console.log('filterBy from action: ', filterBy )
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const toys = await toyService.query(filterBy, sortBy)
        // console.log('toys from action: ', toys )
        store.dispatch({ type: SET_TOYS, toys })
    } catch (err) {
        console.log('toy action -> Cannot load toys', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeToy(toyId) {
    try {
        await toyService.remove(toyId)
        store.dispatch({ type: REMOVE_TOY, toyId })
    } catch (err) {
        console.log('toy action -> Cannot remove toy', err)
        throw err
    }
}

export async function saveToy(toy) {
    console.log('toy: ', toy )
    const type = toy._id ? UPDATE_TOY : ADD_TOY
    try {
        const savedToy = await toyService.save(toy)
        store.dispatch({ type, toy: savedToy })
        return savedToy
    } catch (err) {
        console.log('toy action -> Cannot save toy', err)
        throw err
    }
}
