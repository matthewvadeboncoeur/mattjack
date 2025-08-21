// authController.js

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const { username, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            passwordHash,
            balance: 2000
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


const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({ username: username }).select('+passwordHash')
        if (!existingUser)
            return res.status(401).json({error: 'Wrong username or password'})
        const match = await bcrypt.compare(password, existingUser.passwordHash)
        if (!match)
            return res.status(401).json({error: 'Wrong username or password'})
        const payload = {username: username}
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'})
        res.status(201).json({ message: 'User signed in successfully', accessToken })
    } catch (err) {
        res.status(500).json({ error: 'Server Error'})
    }
}




module.exports = { signup, login }