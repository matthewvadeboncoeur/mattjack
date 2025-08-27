// authMiddleware.js

const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Access denied, no token provided'})
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' })
    }
}

module.exports = verifyToken

