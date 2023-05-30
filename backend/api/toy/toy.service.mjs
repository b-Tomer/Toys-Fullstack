import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
const PAGE_SIZE = 8

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg,
}

async function query(filterBy = {}, sortBy = '') {

    try {
        let toysToDisplay
        const criteria = {}
        if (filterBy.search) {
            criteria.name = { $regex: filterBy.search.toString(), $options: 'i' }
        }
        if (filterBy.inStock === 'true') {
            criteria.inStock = true
        }
        if (filterBy.labels && filterBy.labels.length > 0) {
            criteria.labels = { $all: filterBy.labels }
        }

        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).toArray()


        if (filterBy.pageIdx !== undefined) {
            let startIdx = filterBy.pageIdx * PAGE_SIZE
            toysToDisplay = toys.slice(startIdx, startIdx + PAGE_SIZE)
        }

        if (sortBy === 'createdAt') toysToDisplay = toysToDisplay.sort((a, b) => a.createdAt - b.createdAt)
        if (sortBy === 'price') toysToDisplay = toysToDisplay.sort((a, b) => a.price - b.price)
        if (sortBy === 'title') toysToDisplay = toysToDisplay.sort((a, b) => {
            if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
            else return 1
        })
        return toysToDisplay || toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        // console.log('toy: ', toy )
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            vendor: toy.vendor,
            price: toy.price,
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg, loggedinUser) {
    try {
        const msgToSave = {
            ...msg,
            by: {
                fullname: loggedinUser.fullname,
                _id: loggedinUser._id
            }
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msgToSave } })
        return msgToSave
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
            { _id: ObjectId(toyId) },
            { $pull: { msgs: { id: msgId } } }
        )
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}
