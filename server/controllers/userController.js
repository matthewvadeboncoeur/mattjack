// userController.js

const User = require('../models/User')

const getBalance = async (req, res) => {
    try {
        const { username } = req.user
        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json({ balance: user.balance })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}

module.exports = { getBalance }