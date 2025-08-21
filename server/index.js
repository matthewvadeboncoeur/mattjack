// index.js

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
app.use(cors());
app.use('/auth', authRoutes)

connectDB().then(() => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})