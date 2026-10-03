const express = require('express')
const adminAccessMiddleware = require('../middleware/adminacess-middleware')
const authMiddleware = require('../middleware/auth-middleware')
const uploadMiddleware = require('../middleware/uploadMiddleware')
const { uploadImage, fetchImageController, deleteImageController } = require('../controllers/imageCloudinary-controllers')

const router = express.Router()

// upload the image 
router.post('/upload', authMiddleware, adminAccessMiddleware, uploadMiddleware.single('image'), uploadImage)

// to get all Images 
router.get('/get', authMiddleware, fetchImageController)

// to delete an image by ID 
//6ab9528ee895921781d11955
router.delete('/delete/:id', authMiddleware, adminAccessMiddleware, deleteImageController)

module.exports = router