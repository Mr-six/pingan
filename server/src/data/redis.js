/**
 * redis 数据库
 * 使用redis 存储token 和 ticket
 */

const redis = require('redis')
const Promise = require('bluebird')

// 使用 bluebird 为 node-redis 添加 Promise 接口
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

const options = {
  host : 'localhost', 
  port : '6379', 
  // password : 'html',
  db : 0 //db存储的位置
}

const client = redis.createClient(options)

client.on('ready',function(err){
  console.log('redis ready')
})

client.on("error", function (err) {
  console.log("redis Error :" , err)
})

client.on('connect', function(){
  console.log('Redis连接成功.')
})

/**
 * 保存键值对
 * @param {字符串} key    键值
 * @param {[字符串]} val  值
 * @param {数字} expire   过期时间（可省略）
 * @return {promise对象} 
 */
function setKey (key, val, expire) {
  if (!isNaN(expire) && expire > 0) {
    return client.multi()
      .set(key, val)
      .expire(key, expire) // 设置过期时间
      .execAsync()
  } else {
    return client.setAsync(key, val)
  }
}

/**
 * 获取键值
 * @param  {字符串} key    对应的键值
 * @return {promise对象}   
 */
function getVal (key) {
  return client.getAsync(key)
}

module.exports = {
  setKey,
  getVal
}
