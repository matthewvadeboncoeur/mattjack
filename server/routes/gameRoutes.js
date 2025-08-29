// gameRoutes.js

const express = require('express')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()
const { deal, hit, stand, decide, updateBalance } = require('../controllers/gameController')

router.post('/deal', verifyToken, deal)
router.post('/hit', verifyToken, hit)
router.post('/stand', verifyToken, stand)
router.get('/decide', verifyToken, decide)
router.post('/updateBalance', verifyToken, updateBalance)



module.exports = router