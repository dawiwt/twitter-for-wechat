const promisify = require("../lib/promisify.js")

const req = promisify(wx.request)

const request = (api, method, options) => {
  const url = "http://twitter.dawiwt.com" + api
  options.url = url
  options.method = method
  return req(options)
    .then(res => res.data)
    .catch(err => {
      wx.showToast({ title: err.errorMsg })
      return err
    })
}

const get = (api, data, options = {}) => {
  return request(api, "GET", { ...options, data })
}

const post = (api, data, options = {}) => {
  return request(api, "POST", { ...options, data })
}

module.exports = { get, post }
