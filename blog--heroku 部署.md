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
