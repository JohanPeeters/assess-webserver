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
          let grades = data.data.endpoints.map((ep) => {
            return ep.grade
          })
          let grade = grades.reduce((accumulator, grade) => {
            if (grade !== 'A' && grade !== 'A+')
              reject(new Error(`SSL Labs grade inadequate: ${grade}`))
            if (!accumulator) {
              if (verbose) console.log(`initial grade for ${host}: ${grade}`)
              return grade
            }
            if (accumulator === grade)  {
              if (verbose) console.log(`confirming grade for ${host}: ${grade}`)
              return accumulator
            }
            if (verbose) console.log(`divergent grade for ${host}: ${grade}`)
            return accumulator + ` and ${grade}`
          }, undefined)
          grades.msg = `${host} receives grade ${grade} from SSL Labs`
          resolve(grades)
        }
      })
      emitter.on('error', (err, data) => {
        emitter.clear()
        if (verbose) console.log('rejecting')
        reject(err)
      })
    })
  }
