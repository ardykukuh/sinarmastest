/* global _ */
'use strict'

const _ = require('lodash')

exports.dataResult = (res, obj, status) => {
  var result = {}

  result.status = status || 200

  if (_.isObject(obj)) {
    result.data = obj
  } else {
    result.message = obj
  }

  return res.status(result.status).json(result)
}

exports.errorResult = (res, err, status) => {
    let resultPrint = {}
    resultPrint.status = _.result(err, 'status') || 400
    resultPrint.errors = {}
  
    if (_.isNil(status) && _.isObject(err)) {
      resultPrint.errors.message = _.result(err, 'message') || _.result(err, 'msg') || 'Bad Request'
      resultPrint.errors.fields = _.result(err, 'field') || err
    } else {
      resultPrint.status = status || resultPrint.status
      resultPrint.message = err
      delete resultPrint.errors
  
    }
  
    return res.status(resultPrint.status).json(resultPrint)
}