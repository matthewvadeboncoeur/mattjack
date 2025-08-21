// authController.js

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const { username, password, balance } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            passwordHash,
            balance
        })
        await newUser.save()
        const payload = { username :newUser.username }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'})

        res.status(201).json({ message: 'User successfully created', accessToken })
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ error: 'Username already exists'})
        res.status(500).json({ error: 'Server error' })
    }
}




module.exports = { signup }