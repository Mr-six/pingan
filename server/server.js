/**
 * 微信公众号express
 * 1. 实现服务器验证
 * 2. 网页调用jssdk
 * 3. 数据库写入&查询
 */

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./config') // 微信公众号配置

const wxRouter = require('./router/wx-base')
const wxOauth = require('./router/wx-oauth')

const db_sql = require('./src/data/mysql_db')

const app = express()

app.set('view engine','ejs') //设置模板
app.set('views', __dirname + '/views')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 静态文件
const staticFile = path.resolve(__dirname, '../app/')
app.use(express.static(staticFile))

app.get('/', function (req, res) {  // 主页返回
  res.sendFile('index.html')
})

app.post('/info', function (req, res){
  console.log(req.body)
  if (req.body) {
    db_sql.saveInfo(req.body)
  }
  res.end('ok')
})

app.get('/getdata', function(req, res) {
  db_sql.getInfo().then((data) => {
    res.json(data)
  })
  .catch((e) =>{
    console.log(e)
  })
})
// 获取用户数据
app.get('/getuser', function(req, res) {
  db_sql.getUser().then((data) => {
    res.json(data)
  })
  .catch((e) =>{
    console.log(e)
  })
})

// 测试模板
app.get('/muban',function(req,res) {
  res.render('index',{
    user: {
      name: 'test',
      userid: '23333',
      shi: '测试',
      ups: 100
    }
  })
})

// 微信接口调用路由
app.use('/wx', wxRouter)
// 微信认证接口
app.use('/wx-login', wxOauth)

app.listen(config.port)
console.log('Running on http://localhost:' + config.port)
