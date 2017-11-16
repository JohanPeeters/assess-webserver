const pollingtoevent = require('polling-to-event')
const makeGetRequest = require('./GetRequest').makeGetRequest

let analyzeParams = '&startNew=on&all=done'

const poll = (host) => {
  let config = {
      protocol: 'https',
      host: 'api.ssllabs.com',
      path: `/api/v2/analyze?host=${host}${analyzeParams}`
    }
  analyzeParams = ''
  return makeGetRequest(config)
}

module.exports = (host, verbose=false) => {
    if (verbose) console.log(`start polling ${host}`)
    return new Promise(function(resolve, reject){
      let emitter = pollingtoevent((done) => {
        poll(host).then((result) => {
          done(null, result)
        }).catch((err) => {
          done(err)
        })
      }, {interval: 10000})
      emitter.on('poll', (data) => {
        if (verbose) {
          console.log(`status on ${host}: ${data.data.status}`)
        }
        if (data.data.status === 'READY' || data.data.status === 'ERROR') {
          emitter.clear()
          resolve(data)
        }
      })
      emitter.on('error', (err, data) => {
        emitter.clear()
        reject(err)
      })
    })
  }
