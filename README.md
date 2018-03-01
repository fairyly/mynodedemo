# mynodedemo
mynodedemo---Node+Express + MongoDB 

windows环境下!!!

忽略不提交文件或目录
```
打开 git bash 后，输入 touch .gitignore ,然后在 .gitignore 文件里输入你要忽略的文件夹及其文件就可以

```

* STUDY BY N-BLOG

* https://github.com/nswbmw/N-blog/tree/master/book

1.熟悉 node 
  - 安装 node
  - 安装 nrm :是一个管理 npm 源的工具
  - 安装 MongoDB 可视化管理工具: 原作者推荐用的 [Robomongo](https://robomongo.org/) 和 [Mongochef](https://studio3t.com/#mongochef-download-compare)
  - 

2.熟悉 express (3.1-3.4)
  - 每次修改代码保存后，我们都需要手动重启程序，才能查看改动的效果。使用 supervisor 可以解决这个繁琐的问题，全局安装 supervisor：
  ```
    npm i -g supervisor
    运行 supervisor index 启动程序
  ```
  - [3.1 初始化一个 Express 项目](https://github.com/nswbmw/N-blog/blob/master/book/3.1%20%E5%88%9D%E5%A7%8B%E5%8C%96%E4%B8%80%E4%B8%AA%20Express%20%E9%A1%B9%E7%9B%AE.md)
  - [3.2 路由](https://github.com/nswbmw/N-blog/blob/master/book/3.2%20%E8%B7%AF%E7%94%B1.md)
    ```
      app.get('/users/:name', function (req, res) {
        res.send('hello, ' + req.params.name)
      })
      
      
      req 的属性：

      req.query: 解析后的 url 中的 querystring，如 ?name=haha，req.query 的值为 {name: 'haha'}
      req.params: 解析 url 中的占位符，如 /:name，访问 /haha，req.params 的值为 {name: 'haha'}
      req.body: 解析后请求体，需使用相关的模块，如 body-parser，请求体为 {"name": "haha"}，则 req.body 为 {name: 'haha'}
    ```
  - [3.3 模板引擎 ejs](https://github.com/nswbmw/N-blog/blob/master/book/3.3%20%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E.md)
    ```
      设置:
      app.set('views', path.join(__dirname, 'views'))// 设置存放模板文件的目录
      app.set('view engine', 'ejs')// 设置模板引擎为 ejs
      我们在模板 <%= name.toUpperCase() %> 中使用了 JavaScript 的语法 .toUpperCase() 将名字转化为大写，那这个 <%= xxx %> 是什么东西呢？ejs 有 3 种常用标签：

      <% code %>：运行 JavaScript 代码，不输出
      <%= code %>：显示转义后的 HTML内容
      <%- code %>：显示原始 HTML 内容
      注意：<%= code %> 和 <%- code %> 都可以是 JavaScript 表达式生成的字符串，当变量 code 为普通字符串时，两者没有区别。当 code 比如为       <h1>hello</h1> 这种字符串时，<%= code %> 会原样输出 <h1>hello</h1>，而 <%- code %> 则会显示 H1 大的 hello 字符串。
    ```
  - [3.4 Express 浅析](https://github.com/nswbmw/N-blog/blob/master/book/3.4%20Express%20%E6%B5%85%E6%9E%90.md)
  

3. 学习如何使用 Express + MongoDB 搭建一个博客。
```
Node.js: 8.9.1
MongoDB: 3.4.10
Express: 4.16.2
```

4.准备工作

