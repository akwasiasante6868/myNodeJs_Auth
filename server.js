require('dotenv').config()
const express = require('express')
const connectToDB = require('./DataBase/db')
const authRoutes = require('./routes/auth-routes')
const homeroutes = require('./routes/home-route')
const adminRoutes = require('./routes/admin-routes')
const uploadImageRoute = require('./routes/image-routes')
const deleteImageById = require('./routes/image-routes')

const app = express()

connectToDB()
const PORT = process.env.PORT || 3000




app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/auth/home', homeroutes)
app.use('/api/auth/adminPanel', adminRoutes)
app.use('/api/image', uploadImageRoute)
app.use('/api/changePassword', authRoutes)
app.use("/api/deleteimage/", deleteImageById)

app.listen(PORT, () => {
    console.log(`server is now running on port ${PORT}`)
})


