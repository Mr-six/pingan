/*
*   获取 jsapi_ticket 
*   有效时间为 7200s
*   1. 首先取redis 的值，如果存在着直接返回
*   2. 如果redis 的值为空，这调用saveJsTicket() 获取ticket 并将其保存在redis中
*   3. 
*/

const request = require('request')
const qs = require('querystring')
const redis = require('../data/redis')  // redis 
const config = require('../../config')  // 微信设置
const getToken = require('./getToken')  // 获取token

/**
 * 获取ticket
 * @return {promise} res 值为ticket
 */

function getJsTicket() {  // 获取token
  return redis.getVal('ticket')  // 首先读取 redis 是否存在ticket
    .then(function (res) {  
      if (res === null) {   // 若不存在，则返回saveJsTicket() 获取
        // console.log('不存在ticket 调用saveJsTicket')
        return saveJsTicket ()
      } else {              // 若存在 则直接返回
        // console.log('存在ticket 直接返回')
        return res 
      }
    })
    .catch(function (err) {   // 捕获 错误
      console.log(err)
    })
}

/**
 * 从服务端获取ticket 并保存在redis中
 * @return {promise} 值 为 ticket
 */
function saveJsTicket () {

  return new Promise((resolve, reject) => {

    getToken().then(function (token) {

      let reqUrl = config.ticket_start + token + config.ticket_end
      let options = {
        method: 'get',
        url: reqUrl
      }

      request(options, function (err, res, body) {
        if (res) {
          let bodys = JSON.parse(body)     // 解析微信服务器返回的
          let ticket = bodys.ticket        // 获取 ticket
          let expires = bodys.expires_in   // 获取过期时间

          redis.setKey('ticket', ticket, expires)  // 将ticket 保存到 redis
            .catch(function (err) {
              console.log(err)
            })
          resolve(ticket)
        } else {
          reject(err)
        }
      })
    }).catch(function (err) {
        console.log(err)
    })
  })
}

module.exports = getJsTicket
