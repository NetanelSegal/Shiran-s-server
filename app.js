const express = require('express')
const mainRoute = require('./routes/indexRoute')
const cookieParser = require("cookie-parser");
const app = express()
require("./db/dbConnect")

app.use(cookieParser())
app.use(express.json())
app.use(mainRoute)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})