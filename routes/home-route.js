const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const { homePage } = require('../controllers/home.controller')

const router = express.Router()

router.get('/welcome', authMiddleware, homePage)

module.exports = router