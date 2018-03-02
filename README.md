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

3.连接数据库
  - 使用 Mongolass
  ```
    在 myblog 下新建 lib 目录，在该目录下新建 mongo.js，添加如下代码：

    lib/mongo.js

    const config = require('config-lite')(__dirname)
    const Mongolass = require('mongolass')
    const mongolass = new Mongolass()
    mongolass.connect(config.mongodb)
    
    ------------------------------------------------
    
    lib/mongo.js

    exports.User = mongolass.model('User', {
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
      avatar: { type: 'string', required: true },
      gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
      bio: { type: 'string', required: true }
    })
    exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一
    我们定义了用户表的 schema，生成并导出了 User 这个 model，同时设置了 name 的唯一索引，保证用户名是不重复的。

    小提示：required: true 表示该字段是必需的，default: xxx 用于创建文档时设置默认值。更多关于 Mongolass 的 schema 的用法，请查阅 another-json-schema。

    小提示：Mongolass 中的 model 你可以认为相当于 mongodb 中的 collection，只不过添加了插件的功能。
    
    -----------------------------------------------------------
    
    models/users.js，添加如下代码：

    models/users.js

    const User = require('../lib/mongo').User

    module.exports = {
      // 注册一个用户
      create: function create (user) {
        return User.create(user).exec()
      }
    }
  ```
4. 添加用户

```
  注意：我们使用 sha1 加密用户的密码，sha1 并不是一种十分安全的加密方式，实际开发中可以使用更安全的 bcrypt 或 scrypt 加密。 
  注意：注册失败时（参数校验失败或者存数据库时出错）删除已经上传到 public/img 目录下的头像。
```

5.登出
现在我们来完成登出的功能。修改 routes/signout.js 如下：
```
routes/signout.js

const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null
  req.flash('success', '登出成功')
  // 登出成功后跳转到主页
  res.redirect('/posts')
})

module.exports = router
```

6.登录

```
添加 getUserByName 方法用于通过用户名获取用户信息：

models/users.js

const User = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  }
}
这里我们使用了 addCreatedAt 自定义插件（通过 _id 生成时间戳），修改 lib/mongo.js，添加如下代码：

lib/mongo.js

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})
```

7. 增加文章发表


8. 添加日志

```
使用 winston 和 express-winston 记录日志。

新建 logs 目录存放日志文件，修改 index.js，在：

index.js

const pkg = require('./package')

下引入所需模块：

const winston = require('winston')
const expressWinston = require('express-winston')
将：

// 路由
routes(app)
修改为：

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))
// 路由
routes(app)
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))
刷新页面看一下终端输出及 logs 下的文件。 可以看出：winston 将正常请求的日志打印到终端并写入了 logs/success.log，将错误请求的日志打印到终端并写入了 logs/error.log。

注意：记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后。
```

9. 添加 404 / 505 页面

```
自定义 404 页面。修改 routes/index.js，在：

routes/index.js

app.use('/comments', require('./comments'))
下添加如下代码：

// 404 page
app.use(function (req, res) {
  if (!res.headersSent) {
    res.status(404).render('404')
  }
})

----------------------------------------
新建 views/404.ejs，添加如下代码：

views/404.ejs

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= blog.title %></title>
    <script type="text/javascript" src="http://www.qq.com/404/search_children.js" charset="utf-8"></script>
  </head>
  <body></body>
</html>
```

