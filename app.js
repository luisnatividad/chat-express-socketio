var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var debug = require('debug')('tutorial_socketio');
//var app = require('../app');


/*
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});*/
//module.exports = app;



//socket.io
var server = http.createServer(app);
server.listen(app.get('port'),function(){
    console.log('server Socket.io');
});

var io = require('socket.io').listen(server);

/*
var contador = 0;
io.sockets.on('connection',function(socket){
    contador++;
    console.log('usuario conectado ' + contador + ' usuario(s) ahora.');
    socket.emit('message_event' + {contador:contador});
    socket.broadcast.emit('message_event',{contador:contador}); 
    socket.on('disconnect',function(){
        contador--;
        console.log('Usuario desconectado ' + contador + ' usuario(s) ahora.');
        socket.broadcast.emit('message_event',{contador:contador});
    });
    socket.on('enviando mensaje',function(data){
        socket.broadcast.emit('recibiendo mensaje',data);
    });
});
*/


/*
io.sockets.on('connection',function(socket){
    socket.on('ping',function(data){
        console.log('Recibido PING, enviando PONG');
        socket.emit('pong',{text:'PONG'});
    });
    socket.on('pong',function(){
        console.log('Recibido PONG response. PONG');
    });
    setInterval(function(){
        console.log('enviando PING al cliente');
        socket.emit('pong',{text:'PING'});
    },10000);
});
*/


chat cocket.io
var nicknames = [];
io.sockets.on('connection',function(socket){
    socket.on('nickname',function(data,callback){
        console.log('se ha recibido una conexion de ' + data);  
        if (nicknames.indexOf(data)!=-1) {
            callback(false);
        }else{
            callback(true);
            nicknames.push(data);
            socket.nickname = data;
            io.sockets.emit('nicknames',nicknames);
            console.log('nicknames son ' + nicknames);
        }
    });
    
    socket.on('user message',function(data){
        io.sockets.emit('user message',{
            nick: socket.nickname,
            message: data
        });
    });
    socket.on('disconnect',function(){
        if (!socket.nickname) return;
        if(nicknames.indexOf(socket.nickname)>-1){
            nicknames.splice(nicknames.indexOf(socket.nickname),1);
        }
        console.log('nicknames son ' + nicknames);
    });
});

