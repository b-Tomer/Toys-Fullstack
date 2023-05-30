import { logger } from '../services/logger.service.mjs'

export { log }

async function log(req, res, next) {
    const { baseUrl, params, query } = req

    logger.info('Req was made', baseUrl, params, query)
    next()
}