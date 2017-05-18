/**
 * mysql连接
 * 1. 保存信息函数
 * 2. 读取信息
 */
const mysql = require('mysql')

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'wxtest',
  charset  : 'utf8mb4' 
})

// 保存信息
function saveInfo (info) {
  // 连接
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
    console.log('connected as id ' + connection.threadId)
    // 写入数据
    var userAddSql = 'INSERT INTO nibansh(id,prov,tel,time) VALUE(0,?,?,?)'
    var userAddSql_parse = [info.province,info.tel,info.time]
    connection.query(userAddSql,userAddSql_parse,
      function(err, rows) {
        if (err) {
          console.error('error connecting: ' + err.stack)
          // 关闭数据库连接
          connection.end()
          return
        } else {
          // console.log(rows)
          console.log('一条数据写入成功')
          connection.release()
        }
    })
  })
}

// 读取信息
function getInfo () {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('error connecting: ' + err.stack)
        reject(err)
      }
      // 使用连接2017/2/27 下午9:01:16
      connection.query( 'SELECT * FROM nibansh', function(err, results, fields) {
        if (err) {
          console.error('error connecting: ' + err.stack)
          connection.release();
          return 
        }
        resolve(results)
        // 使用连接执行查询
        connection.release()
      })
    })
  })
}

// 保存用户信息
function saveUser (user) {
  // 连接
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
    console.log('connected as id ' + connection.threadId)
    // 写入数据
    var userAddSql = 'INSERT INTO user(id, nickname, headimgurl, voice, ups, time) VALUE(0,?,?,?,?,?)'
    var userAddSql_parse = [user.nickname, user.headimgurl, user.voice, user.ups, user.time]
    connection.query(userAddSql,userAddSql_parse,
      function(err, rows) {
        if (err) {
          console.error('error connecting: ' + err.stack)
          // 关闭数据库连接
          connection.end()
          return
        } else {
          // console.log(rows)
          console.log('一条用户信息写入成功')
          connection.release()
        }
    })
  })
}

// 读取用户信息
function getUser () {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('error connecting: ' + err.stack)
        reject(err)
      }
      // 使用连接2017/2/27 下午9:01:16
      connection.query( 'SELECT * FROM user', function(err, results, fields) {
        if (err) {
          console.error('error connecting: ' + err.stack)
          connection.release();
          return 
        }
        resolve(results)
        // 使用连接执行查询
        connection.release()
      })
    })
  })
}



var db_sql = {
  saveInfo,
  getInfo,
  saveUser,
  getUser
}
module.exports = db_sql
