'use strict'

const request = require('async-request') 

exports.get = async (url, data = null) => {
  const options = {
    method : 'GET'
  }

  const result = await request(url, options)

  if (result.statusCode !== 200) {
    return result
  }

  return JSON.parse(result.body)
}
