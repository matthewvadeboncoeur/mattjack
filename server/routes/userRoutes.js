// userRoutes.js

const express = require('express')
const { getBalance } = require('../controllers/userController')
const verifyToken = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/balance', verifyToken, getBalance)

module.exports = router