const router = require('express').Router()
const request = require('request')

const db_sql = require('../src/data/mysql_db')

const {base_url, appid, appsecret} = require('../config')

router.get('/', function(req, res, next){
  console.log("oauth - login")

  // 第一步：用户同意授权，获取code
  let router = 'get_wx_access_token'
  // 这是编码后的地址
  let return_uri = encodeURIComponent(base_url + 'wx-login/' + router)
  console.log('回调地址:' + return_uri)
  let scope = 'snsapi_userinfo'

  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect')
})

router.get('/get_wx_access_token', function(req,res, next){
  console.log("get_wx_access_token")
  console.log("code_return: "+req.query.code)

  // 第二步：通过code换取网页授权access_token
  let code = req.query.code
  request.get(
    {   
      url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret+'&code=' + code + '&grant_type=authorization_code',
    },
    function(error, response, body){
      if(response.statusCode === 200){

        // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
        // console.log(JSON.parse(body))

        let data = JSON.parse(body)
        let access_token = data.access_token
        let openid = data.openid

        request.get(
          {
            url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
          },
          function(error, response, body){
            if(response.statusCode == 200){

              // 第四步：根据获取的用户信息进行对应操作
              let userinfo = JSON.parse(body)
              console.log(JSON.parse(body))
              console.log('获取微信信息成功！')

              // 小测试，实际应用中，可以由此创建一个帐户
              // res.send("\
              //     <h1>"+userinfo.nickname+" 的个人信息</h1>\
              //     <p><img src='"+userinfo.headimgurl+"' /></p>\
              //     <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
              // ")
              res.render('index',{
                user: {
                  name: userinfo.nickname,
                  userid: userinfo.openid,
                  shi: '测试',
                  ups: 100,
                  city: userinfo.city
                }
              })
              // 储存用户信息
              // db_sql.saveUser({
              //   nickname: userinfo.nickname,
              //   headimgurl: userinfo.headimgurl,
              //   voice: null,
              //   ups: 0,
              //   time: new Date()
              // })

            }else{
              console.log(response.statusCode)
            }
          }
        )
      }else{
        console.log(response.statusCode)
      }
    }
  )
})

module.exports = router
