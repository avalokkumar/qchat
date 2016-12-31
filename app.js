var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.port | 3000;
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    index = require('./routes/index'),
    users = require('./routes/users'),


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*app.set('views', path.join(__dirname, 'public/views')),*/
app.use(express.static(__dirname+ '/public')),
app.use('/bower_components', express.static(__dirname + '/bower_components')),
app.use(logger('dev')),
app.use(bodyParser.json()),
app.use(bodyParser.urlencoded({ extended: false })),

io.on('connection', function (client) {
    //console.log('Client Connected...');
    client.on('join', function(name){
        client.nickname = name;
    })
    client.on('messages', function (data) {
        var nickname = client.nickname;
        console.log(nickname +' Said : '+data);
        client.broadcast.emit('message ', nickname+ ": "+data);
        client.emit('messages', nickname+ ': '+data)
    });
});
app.get("/", function(err, res) {
/*    if(err){
        console.log(err.message);
    }*/
    res.sendFile(__dirname + "/public/views/index.html");
});
server.listen(port, function(){
    console.log("Server listening to port "+port);
});

module.exports = app;




// error handler
/*app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};
 // render the error page
 res.status(err.status || 500);
 res.render('error');
 });*/