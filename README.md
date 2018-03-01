# mynode blog

### myblog-basestruct

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
=====================================
routes/signin.js

const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('登录页')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('登录')
})

module.exports = router

```
* 修改根目录下 index.js 如下：
```
index.js

const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
注意：中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，
这样静态文件的请求就不会落到业务逻辑的路由里；
flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 实现的。

运行 supervisor index 启动博客，访问以下地址查看效果：

http://localhost:3000/posts
http://localhost:3000/signout
http://localhost:3000/signup
```

### myblog-node-adduser

1.添加各个路由对应模板的页面和样式, 添加公共头,公共尾

2.设置全局变量: app.locals 和 res.locals
  ```
    app.locals 上通常挂载常量信息（如博客名、描述、作者这种不会变的信息），
    res.locals 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，res.locals.user = req.session.user）。

    修改 index.js，在 routes(app) 上一行添加如下代码：

  // 设置模板全局常量
  app.locals.blog = {
    title: pkg.name,
    description: pkg.description
  }

    // 添加模板必需的三个变量
    app.use(function (req, res, next) {
      res.locals.user = req.session.user
      res.locals.success = req.flash('success').toString()
      res.locals.error = req.flash('error').toString()
      next()
    })
这样在调用 res.render 的时候就不用传入这四个变量了，express 为我们自动 merge 并传入了模板，所以我们可以在模板中直接使用这四个变量。
```
