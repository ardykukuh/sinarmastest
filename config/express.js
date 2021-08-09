/* global env */
'use strict'

const path = require('path')
const expressValidator = require('express-validator')
const helmet = require('helmet')
const CORS = require('cors')
const bodyParser = require('body-parser')

module.exports = (app) => { 
  app.set('env', env)
  app.set('port', process.env.PORT || 3000)
  app.options('*', CORS())
  app.use(CORS())
  app.use(expressValidator())
  app.use(bodyParser.json());
 

  app.use(helmet());
  /** ROUTES Apps */
  require(process.cwd() + '/api/routes')(app)
}