const express = require('express')
const cors = require('cors')
const Routes = require('./Routes/Route')
const Connection = require("./Connection")
const dotenv = require('dotenv').config()

// dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

Connection()

app.use("/Api", Routes)

app.listen(process.env.PORT_NO, () => console.log("Server is working at:"+process.env.PORT_NO))