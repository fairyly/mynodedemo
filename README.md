# mynode blog

myblog-basestruct

blog 基础结构

安装 mongodb  运行 MongoDB 服务器: D:\mongodb\bin>mongod --dbpath D:\mongodb\data  

* 主要目录:
```
  models: 存放操作数据库的文件
  public: 存放静态文件，如样式、图片等
  routes: 存放路由文件
  views: 存放模板文件
  index.js: 程序主文件
  package.json: 存储项目名、描述、作者、依赖等等信息
```
* 安装依赖模块
```
  npm i config-lite connect-flash connect-mongo ejs express express-formidable express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save
  
  模块的用处：

  express: web 框架
  express-session: session 中间件
  connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
  connect-flash: 页面通知的中间件，基于 session 实现
  ejs: 模板
  express-formidable: 接收表单及文件上传的中间件
  config-lite: 读取配置文件
  marked: markdown 解析
  moment: 时间格式化
  mongolass: mongodb 驱动
  objectid-to-timestamp: 根据 ObjectId 生成时间戳
  sha1: sha1 加密，用于密码加密
  winston: 日志
  express-winston: express 的 winston 日志中间件
```

* 配置文件
  - config-lite
  ```
    myblog 下新建 config 目录，在该目录下新建 default.js，添加如下代码
    module.exports = {
      port: 3000,
      session: {
        secret: 'myblog',
        key: 'myblog',  
        maxAge: 2592000000
      },
      mongodb: 'mongodb://localhost:27017/myblog'
    }
    
    port: 程序启动要监听的端口号
    session: express-session 的配置信息，后面介绍
    mongodb: mongodb 的地址，以 mongodb:// 协议开头，myblog 为 db 名
  ```
* 权限控制
  ```
    在 myblog 下新建 middlewares 目录，在该目录下新建 check.js，添加如下代码：
    module.exports = {
      checkLogin: function checkLogin (req, res, next) {
        if (!req.session.user) {
          req.flash('error', '未登录')
          return res.redirect('/signin')
        }
        next()
      },

      checkNotLogin: function checkNotLogin (req, res, next) {
        if (req.session.user) {
          req.flash('error', '已登录')
          return res.redirect('back')// 返回之前的页面
        }
        next()
      }
    }
  ```
* 创建以下路由文件：
```
routes/index.js

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}

================================================
routes/posts.js

const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  res.send('主页')
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  res.send('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.send('发表文章页')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  res.send('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

module.exports = router
======================================================
routes/comments.js :

const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  res.send('创建留言')
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  res.send('删除留言')
})

module.exports = router

其他路由 js 类似以上写法
```
