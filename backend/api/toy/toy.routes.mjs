import express from 'express'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.mjs'

const router = express.Router()

// If we want a specific middleware (i.e. requireAuth) 
// to be activated on all end points of this router:
// router.use(requireAuth)

router.get('/', log, getToys)
router.get('/:id', getToyById)
router.post('/', log, requireAuth, addToy)
router.put('/:id', requireAuth, updateToy)
// router.delete('/:id', requireAuth, removeToy)
router.delete('/:id', requireAuth, requireAdmin, removeToy)

router.post('/:id/msg', requireAuth, addToyMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)

export const toyRoutes = router
