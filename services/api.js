const { get, post } = require("./request.js")

const getapi = {
  fetchTimeline: "/api/twitter/timeline.json"
}

const postapi = {}

const apis = {}

const getify = url => {
  return (data, options) => {
    return get(url, data, options)
  }
}

const postify = url => {
  return (data, options) => {
    return post(url, data, options)
  }
}

Object.keys(getapi).forEach(api => {
  apis[api] = getify(getapi[api])
})

Object.keys(postapi).forEach(api => {
  apis[api] = postify(postapi[api])
})

module.exports = apis
