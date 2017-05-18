// const redis = require('../server/src/data/redis')
// const getJsTicket = require('../server/src/wx/getJsTicket')
// const getToken = require('../server/src/wx/getToken')
// const jsSdk = require('../server/src/wx/jsSdk')
const mysql = require('mysql')

pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database:  'wxtest'
})

function test_sql () {
  // 连接
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
    console.log('connected as id ' + connection.threadId)
  })
}
test_sql()

// redis 储存键值
// redis.setKey('token', '8sdfjief', 30)
//   .then(function (res) {
//     console.log(res)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// redis 获取键值
// redis.getVal('token')
//   .then(function (res) {
//     console.log(res === null)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// 获取js_ticket
// getJsTicket()
//   .then(function(res){
//     console.log(res)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// 获取token
// getToken()
//   .then(function(res){
//     console.log(res)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// 获取jssdk所需对象
// jsSdk('http://j.ngrok.mrsix.top')
//   .then(function (res) {
//     console.dir(res)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
