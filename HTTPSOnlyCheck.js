const makeGetRequest = require('./GetRequest').makeGetRequest

module.exports = (host) => {
  const config = {
    protocol: 'http',
    host: host,
    path: '/'
  }
  return makeGetRequest(config).then((result) => {
    return Promise.reject(`${host} is available over plain HTTP`)
  }).catch((error) => {
    return Promise.resolve(`${host} is not available over plain HTTP`)
  })
}
