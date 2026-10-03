const express = require('express')
const { adminPage } = require('../controllers/admin-controllers')
const authMiddleware = require('../middleware/auth-middleware')
const adminAccessMiddleware = require('../middleware/adminacess-middleware')

const router = express.Router()

router.get('/welcome', authMiddleware ,adminAccessMiddleware, adminPage)

module.exports = router