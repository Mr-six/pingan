/**
 * 1. appId 必填，公众号的唯一标识
 * 2. timestamp 必填，生成签名的时间戳
 * 3. nonceStr 必填，生成签名的随机串
 * 4. signature 必填，签名
 */

const crypto = require('crypto')
const getJsTicket = require('./getJsTicket')
const config = require('../../config')  // 微信设置

// sha1加密
function sha1(str) {
  let shasum = crypto.createHash("sha1")
  shasum.update(str)
  str = shasum.digest("hex")
  return str
}

/**
 * 生成签名的时间戳
 * @return {字符串} 
 */
function createTimestamp () {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串} 
 */
function createNonceStr () {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns {对象} 返回微信jssdk所需参数对象
*/
function sign (jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  }
  var string = raw(ret)
  ret.signature = sha1(string)
  ret.appId =  config.appid
  return ret
}

/**
 * 返回微信jssdk 所需参数对象
 * @param  {字符串} url 当前访问URL
 * @return {promise}     返回promise类 val为对象
 */
function jsSdk (url) {
  return getJsTicket()
    .then(function (ticket) {
      return sign(ticket, url)
    })
    .catch(function (err) {
      console.log(err)
    })
}

function routerSdk (req, res, next) {
  let clientUrl = req.body.url
  if (clientUrl) {
    jsSdk(clientUrl)
      .then(function (obj) {
        res.json(obj)
      })
  } else {
    res.end('no url')
  }
}

module.exports = routerSdk
