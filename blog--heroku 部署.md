# blog--heroku 部署

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
