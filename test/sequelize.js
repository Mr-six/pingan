const Sequelize = require('sequelize')
const sequelize = new Sequelize('user_test', 'root', 'root', {
  'dialect': 'mysql',
  'host': 'localhost',
  'port': 3306
})

// 定义model
var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
})
// 表结构同步
// sequelize.sync().then(function() {
//   return User.create({
//     username: 'jjj',
//     birthday: new Date(2011, 6, 20)
//   })
// })
User.findAll().then(function (result){
  // 查询结果
  console.log(result);
}).catch(function(err){
  // 出错了
  console.log(err); 
})

