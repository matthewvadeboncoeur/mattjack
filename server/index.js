// index.js

require('dotenv').config({ path: __dirname + '/../.env' })
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
app.use(cors())
app.use('/auth', authRoutes)
const userRoutes = require('./routes/userRoutes')
app.use('/user', userRoutes)
const gameRoutes = require('./routes/gameRoutes')
app.use('/game', gameRoutes)

connectDB().then(() => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})