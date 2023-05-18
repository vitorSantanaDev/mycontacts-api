const express = require('express')
require('express-async-errors')

const routes = require('./routes')

const cors = require('./app/middlewares/cors')
const errorHandler = require('./app/middlewares/error-handler')

const app = express()

app.use(express.json())
app.use(cors)
app.use(routes)
app.use(errorHandler)

app.listen(3001, () =>
	console.log(`Server Started at http://localhost:3001 🚀`)
)
