module.exports = {
  token: 'weixinqiang',
  encodingaeskey: 'ojX6265ThJQkPik6lYKxw3wTbgEkihMm7l6Ijdt3Qku',
  appid: 'wx86f5a7722a8283f7',
  appsecret: '4d3ff9798d68a1390506a966400dbbbb',
  port: 80,

  base_url: 'http://hh5.wechat2016.com/',

  // 获取getToken URL
  gettoken_url: 'https://api.weixin.qq.com/cgi-bin/token?',

  // 获取jsapi_ticket（一般不会变吧）
  ticket_start: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=',
  ticket_end: '&type=jsapi'
}
