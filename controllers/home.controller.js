
const homePage = async (req, res) => {
    const {username, userID, role} = req.userInfo

    res.json({
        message : 'Welcome to the homepage',
        user: {
            _id: userID,
            username: username,
            role: role
        }
    })
}

module.exports = { homePage }