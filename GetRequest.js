const https = require('https')
const http = require('http')

const makeGetRequest = (config) => {
  const {protocol, host, path, successMsg, failureMsg, expectedContent} = config
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      method: 'GET',
      path: path,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let scheme = protocol === 'http'?http:https
    const req = scheme.request(options, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {rawData += chunk})
      res.on('end', () => {
        const statusCode = res.statusCode
        if (statusCode == 200) {
          if (expectedContent) {
            if (expectedContent != rawData) {
                let err = new Error(`expected at https://${host}/${path}: ${expectedContent}`)
                err.actualContent = rawData
                reject(err)
            }
          }
          let body
          try {
            body = JSON.parse(rawData)
          } catch (e) {
            body = rawData
          }
          resolve({data: body, msg: successMsg})
        } else {
          let err = new Error(failureMsg)
          err.statusCode = statusCode
          err.rawData = rawData
          reject(err)
        }
      })
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.end()
  })
}

module.exports = {
  makeGetRequest: makeGetRequest
}
