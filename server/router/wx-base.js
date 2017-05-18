/**
 * 微信基础API调用路由
 * 1. 微信服务器验证
 * 2. 微信jssdk
 */
const router = require('express').Router()

const wechatCheck = require('../src/wx/wechatCheck')  // 服务器验证
const webJsSdk = require('../src/wx/jsSdk')
// 服务器验证
router.get('/wechat',wechatCheck)

// 获取jssdk
router.post('/sdk', webJsSdk)

module.exports = router
