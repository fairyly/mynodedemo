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
```
