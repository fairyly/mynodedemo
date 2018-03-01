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

