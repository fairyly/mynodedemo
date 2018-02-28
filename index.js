//const express = require('express')
//const app = express()

//app.get('/', function (req, res) {
//  res.send('hello, test')
//})
//
//app.get('/users/:name', function (req, res) {
//  res.send('hello, ' + req.params.name)
//})

const path = require('path')
const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

app.set('views', path.join(__dirname, 'views'))// 设置存放模板文件的目录
app.set('view engine', 'ejs')// 设置模板引擎为 ejs

//app.use('/', indexRouter)
app.use('/user', userRouter)

app.use(function (req, res, next) {
  console.log('1')
  ext(new Error('haha'))
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

//错误处理
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.listen(3000)
console.log('server start 3000')