var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    index = require('./routes/index'),
    users = require('./routes/users'),
    app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*app.set('views', path.join(__dirname, 'public/views')),*/
app.use(express.static(__dirname+ '/public')),
app.use('/bower_components', express.static(__dirname + '/bower_components')),
app.use(logger('dev')),
app.use(bodyParser.json()),
app.use(bodyParser.urlencoded({ extended: false })),

app.get("/", function(err, res) {
    if(err){
        console.log(err.message);
    }
    res.sendFile(__dirname + "/public/views/index.html");
});

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
