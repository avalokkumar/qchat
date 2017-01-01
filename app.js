var express = require('express'),
    app = express(),
    mongojs = require("mongojs"),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    db = mongojs("qchat", [ "qchat" ]),
    port = process.env.port | 3000;
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    messages = [],
    bodyParser = require('body-parser'),
    index = require('./routes/index'),
    users = require('./routes/users'),
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    /*app.set('views', path.join(__dirname, 'public/views')),*/
    app.use(express.static(__dirname+ '/public')),
    app.use('/bower_components', express.static(__dirname + '/bower_components')),
    app.use(logger('dev')),
    app.use(bodyParser.json()),
    app.use(bodyParser.urlencoded({ extended: false }));

var storeMessages = function(name, data) {
    if(messages.length > 16){
        messages.shift();
    }
    messages.push({name: name, data: data});
    //var messageToPush = JSON.stringify(messages);
    console.log(messages+' inside storeMessage');
    db.qchat.insert(messages, function(err, msg){
        console.log(msg +' Successfully Saved');
    })
}

io.on('connection', function (client) {
    console.log('Client Connected...');
    var messagesObj = {};
    client.on('join', function(name){
        client.nickname = name;
        db.qchat.find(function(err, storedMessages) {
            if(storedMessages.length === 0){
                console.log("No Message to display");
            }else{
                try {
                    messagesObj = JSON.parse(storedMessages);
                    console.log('Stored Message \n'+storedMessages);
                } catch(e) {
                    console.log('malformed request', storedMessages);
                }
            }
        });
        messages.forEach(function (message) {
            client.emit("messages", message.name+ ' : '+message.data);
        })
    })
    client.on('messages', function (data) {
        var nickname = client.nickname;
        console.log(nickname +' Said : '+data);
        var msg = nickname+ ": "+data;
        /*messages.push(msg);*/
        storeMessages(nickname, data);
        client.broadcast.emit('message', msg);
        client.emit('messages', msg)
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