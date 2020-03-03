require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index')
var userRouter = require('./routes/user.routes')
var uploadRouter = require('./routes/upload.routes')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/uploads', uploadRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

app.use(function(err, req, res, next) {
  console.log(
    'XXXXXXX__________ERROR caught in final error handler__________XXXXXXX'
  )
  console.log(err)

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
