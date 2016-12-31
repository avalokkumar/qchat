var http = require('http'), app = require('./app'), port = process.env.port | 3000;

http.createServer(app).listen(port, function(){
   console.log("Server listening to port "+port);
});
