const express = require('express')
const indexRoute = require('./routes/indexRoute')
const path = require('path')
const app = express()
require("./db/dbConnect")
const port = 3001

app.use(express.json())
app.use(indexRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})