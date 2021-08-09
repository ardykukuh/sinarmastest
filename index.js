'use strict'

const path = require('path')
global.express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app) 
const {baseAPI} = require('./config/constant');
  
require('dotenv').config()

global.env = process.env.NODE_ENV

require(path.join(__dirname, '/config/express'))(app)

server.listen(app.get('port'), () => {
  console.log(`\n App listening at http://localhost:${app.get('port')} in ${env} mode`)
})

module.exports.server = http.createServer(app)