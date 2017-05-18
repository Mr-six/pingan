## 提供数据库连接访问接口
1. mysql数据写入读取
2. redis 键值对操作

修改字符集
ALTER DATABASE wxtest CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tbl` (...) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

node-mysql 参数
charset  : 'utf8mb4' 

创建数据库
create database wxtest character set utf8mb4;

node-mysql 创建数据库


获取微信信息数据库
```
create table user (
  id int unsigned not null auto_increment primary key,
  nickname char(200) null,
  useid char(200) null,
  city char(100) null,
  ups int null default 0,
  voice char(100) null,
  shi char(100) null,
  time char(50) null,
  back char(100) null
  ) CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

使用sequelize 创建数据


```
const Sequelize = require('sequelize')
const sequelize = new Sequelize('user_test', 'root', 'root',{
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
})

sequelize.sync().then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  })
})
```

sequelize.query('SELECT * from user_test')
  .then(function (res) {
    console.log(res)
  })
