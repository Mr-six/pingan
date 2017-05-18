/*
*   获取 access_token 
*   有效时间为 7200s
*/

const request = require('request')
const qs = require('querystring')
const redis = require('../data/redis')  // redis 
const config = require('../../config') // 微信设置

/**
 * 获取token
 * @return {promise} res 值为token
 */
function getToken () {
  return redis.getVal('token')  // 首先读取 redis 是否存在token
    .then(function (res) {  
      if (res === null) {   // 若不存在，则返回savetoken() 获取
        // console.log('不存在token 调用saveToken')
        return saveToken ()
      } else {              // 若存在 则直接返回
        // console.log('存在token 直接返回')
        return res 
      }
    })
    .catch(function (err) {   // 捕获 错误
      console.log(err)
    })
}

/**
 * 从服务端获取token 并保存在redis中
 * @return {promise} 值 为 token
 */
function saveToken () {

  return new Promise((resolve, reject) => {

    let reqUrl = config.gettoken_url
    let params = {
      grant_type: 'client_credential',
      appid: config.appid,
      secret: config.appsecret
    }

    let options = {
      method: 'get',
      url: reqUrl + qs.stringify(params)
    }

    request(options, function (err, res, body) {
      if (res) {
        let bodys = JSON.parse(body)
        let expires = bodys.expires_in
        let token = bodys.access_token
        
        redis.setKey('token', token, expires)  // 将token 保存到 redis
          .catch(function (err) {
            console.log(err)
          })

        resolve(token)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = getToken
