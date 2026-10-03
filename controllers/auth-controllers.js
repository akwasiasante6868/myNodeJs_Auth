const User = require('../Models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// register controller
const registerUser = async (req, res) => {
    try {
        // extract user information from request body
        const { username, email, password, role } = req.body

        // check if user already exists in the database
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists in the database'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user'
        })

        await newlyCreatedUser.save()

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message: 'New User Created sucessfully'
            })
        }
        else{
            res.status(400).json({
                success : false,
                message: `Couldn't create a new account`
            })
        }



    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Some error occurred, please try again'
        })
    }
}


// login controller
const loginUser = async (req, res) => {
    try {
        //extract your username and password
        const { username, password } = req.body

        //check for unexisting registers

        const user  = await User.findOne({username})
        if(!user){
            return res.status(400).json({
                success: false,
                message : 'Invalid username. Please try again'
            })
        }


        // if the password is correct or not 
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message : 'Invalid Password, Please Try Again'
            })
        }
        
        // We need to create a user token now
        const accessToken = jwt.sign({
            userID : user._id,
            username : user.username,
            role : user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : "15m"
        })
        
        res.status(200).json({
            success : true,
            message : 'Logged in successfully',
            accessToken
        })
       

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Some error occurred, please try again'
        })
    }
}

//Change Password 
const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userID

        // extract old and new password
        const {oldPassword, newPassword} = req.body

        //find the current log in user
        const user = await User.findOne(userId)

        if(!user){
            return res.status(400).json({
                success : false,
                message : 'This user does not exist. Please try again'
            })
        }

        //check if the old password is correct 
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'Incorrect old password. please enter the correct password'
            })
        }

        //hash the new password

        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword, salt)

        //update user password
        user.password = newHashedPassword
        await user.save

        res.status(200).json({
            success : true,
            message : 'Password is updated successfully'
        })

    } catch (e) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again'
        })
        
    }
}

module.exports = { registerUser, loginUser, changePassword}
