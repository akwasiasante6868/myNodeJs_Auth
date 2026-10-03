const express = require('express')
const router = express.Router()
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controllers')
const authMiddleware = require('../middleware/auth-middleware')



router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/updatePassword', authMiddleware, changePassword)

 

module.exports = router