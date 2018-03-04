# blog--heroku 部署

* 已经部署到 heroku: https://desolate-coast-83590.herokuapp.com/posts

* mongodb 数据库申请 [MLab](https://mlab.com/)
  - 创建数据、用户名和密码，最后得到连接
  ```
    To connect using the mongo shell:
    % mongo ds151528.mlab.com:51528/myblog -u <dbuser> -p <dbpassword>
    
    To connect using a driver via the standard MongoDB URI (what's this?):
    mongodb://<dbuser>:<dbpassword>@ds151528.mlab.com:51528/myblog
    
    yhq   yhq123456

  ```
  - 如我创建的用户名和密码都为 myblog 的用户，新建 config/production.js，添加如下代码：
  ```
    config/production.js

    module.exports = {
      mongodb: 'mongodb://myblog:myblog@ds139327.mlab.com:39327/myblog'
    }
    停止程序，然后以 production 配置启动程序:

    NODE_ENV=production supervisor index
    注意：Windows 用户全局安装 cross-env，使用：

    npm i cross-env -g
    cross-env NODE_ENV=production supervisor index
  ```
  
* cross-env： https://github.com/kentcdodds/cross-env
  - Run scripts that set and use environment variables across platforms

* pm2

当我们的博客要部署到线上服务器时，不能单纯的靠 node index 或者 supervisor index 来启动了，  
因为我们断掉 SSH 连接后服务就终止了，这时我们就需要像 pm2 或者 forever 这样的进程管理工具了。  
pm2 是 Node.js 下的生产环境进程管理工具，就是我们常说的进程守护工具，  
可以用来在生产环境中进行自动重启、日志记录、错误预警等等。  
以 pm2 为例，全局安装 pm2：  

```
npm i pm2 -g

```

修改 package.json，添加 start 的命令：
```
package.json

"scripts": {
  "test": "istanbul cover _mocha",
  "start": "NODE_ENV=production pm2 start index.js --name 'myblog'"
}
```

然后运行 npm start 通过 pm2 启动程序

pm2 常用命令:
```
pm2 start/stop: 启动/停止程序
pm2 reload/restart [id|name]: 重启程序
pm2 logs [id|name]: 查看日志
pm2 l/list: 列出程序列表
更多命令请使用 pm2 -h 查看。
```


>>> 我在 windows 系统遇到问题： npm start 时候出现 'NODE_ENV' 不是内部或外部命令，也不是可运行的程序或批处理文件。
最后 看到 http://blog.csdn.net/z69183787/article/details/54138818 设置 "start": "cross-env NODE_ENV=production pm2 start index.js --name 'myblog'"
使用方法：
安装across-env:npm install cross-env --save-dev

在NODE_ENV=xxxxxxx前面添加cross-env就可以了。

 set NODE_ENV=development && webpack --config webpack.config.dev.js
 
也可以实现一样的效果



* heroku :https://www.heroku.com/home

打开 index.js，将 app.listen 修改为：

```
const port = process.env.PORT || config.port
app.listen(port, function () {
  console.log(`${pkg.name} listening on port ${port}`)
})
```
因为 Heroku 会动态分配端口（通过环境变量 PORT 指定），所以不能用配置文件里写死的端口。

3.修改 package.json，在 scripts 添加：
```
"heroku": "NODE_ENV=production node index"
```
在根目录下新建 Procfile 文件，添加如下内容：
```
web: npm run heroku
```
Procfile 文件告诉 Heroku 该使用什么命令启动一个 web 服务。更多信息见：https://devcenter.heroku.com/articles/getting-started-with-nodejs。

然后输入以下命令：
```
git init
heroku git:remote -a 你的应用名称
git add .
git commit -am "init"
git push heroku master
```
稍后，就部署成功了。使用：

heroku open

打开应用主页。如果出现 "Application error"，使用：

heroku logs

查看日志，调试完后 commit 并 push 到 heroku重新部署。


+++++++++++++++++++++++++++++++++++++++++++++++++

* 部署问题

1. 如果有目录不存在，会出现 application error；遇到的就是 logs 目录不存在，报错了

