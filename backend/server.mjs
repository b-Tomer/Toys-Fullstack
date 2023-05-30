import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { logger } from './services/logger.service.mjs'

const app = express()

// Express App Config:

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// Our server's routes (end points) - grouped by feature:

import { authRoutes } from './api/auth/auth.routes.mjs'
app.use('/api/auth', authRoutes)

import { userRoutes } from './api/user/user.routes.mjs'
app.use('/api/user', userRoutes)

import { toyRoutes } from './api/toy/toy.routes.mjs'
app.use('/api/toy', toyRoutes)

import { reviewRoutes } from './api/review/review.routes.mjs'
app.use('/api/review', reviewRoutes)

// Create a fallback route:
// Make every request for which there is no end point match the index.html
// so when requesting http://localhost:3030/index.html/toy/123 
// it will still respond withour SPA (single page app - the index.html file) 
// and allow the frontend router to take it from there

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3030

app.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})