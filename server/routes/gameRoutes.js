// gameRoutes.js

const express = require('express')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()
const { deal, hit, stand } = require('../controllers/gameController')

router.post('/deal', verifyToken, deal)
router.post('/hit', verifyToken, hit)
router.post('/stand', verifyToken, stand)




module.exports = router