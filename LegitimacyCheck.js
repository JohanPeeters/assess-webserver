const makeGetRequest = require('./GetRequest').makeGetRequest

module.exports = (host) => {
  const aliveConfig = {
    protocol: 'https',
    host: host,
    path: '/',
    successMsg: `${host} is alive`,
    failureMsg: `failed to connect to ${host}`
  }
  const aliveCheckPromise = makeGetRequest(aliveConfig)
  let inviteCheckConfig = {
      protocol: 'https',
      host: host,
      path: '/assess_me',
      successMsg: `${host} to be assessed`,
      failureMsg: `${host} should not be assessed`,
      expectedContent: host
    }
  inviteCheckPromise = makeGetRequest(inviteCheckConfig)
  return Promise.all([aliveCheckPromise, inviteCheckPromise])
}
