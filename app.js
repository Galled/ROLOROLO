/* Ejemplo de como crear un servidor en nodejs */
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.set('views', __dirname + '/views');
app.use(express.static(__dirname));
app.get('/', function(req,res){
	res.render('index.jade', {layout:false});
});
server.listen(8080);


//websockets

var io = require('socket.io').listen(server);
var usuariosConectados = [];

function updateUsuarios(nombreUsuario){
		
	if (!(!nombreUsuario)) {
		console.log('procesando nombreUsuario', nombreUsuario);
		usuariosConectados[usuariosConectados.length] = nombreUsuario;
	}
	var data = usuariosConectados;
	
	console.log('enviando a la procesaUsuarios()',data);
	io.sockets.emit('procesaUsuarios', data);
}//updateUsuarios

io.sockets.on('connection',function(socket){
		
	console.log('Conectado una nueva socket',socket.nickname);
	
	socket.on('eventoInicio', function(){
		console.log('La socket se ha iniciado correctamente');
		updateUsuarios();
	});
	socket.on('eventoEnviarNombre', function(dato){
	
		if(usuariosConectados.indexOf(dato)==-1){
			socket.nickname = dato;
			updateUsuarios(socket.nickname);
		}
		else
		{			
			io.sockets.emit('errorName');	
		}
		
	});
	socket.on('eventoEnviarMensaje', function(mensaje){
		var data = [ socket.nickname, mensaje];
		io.sockets.emit('procesaMensaje',data);
	});
	socket.on('disconnect', function(){
		if(socket.nickname){
			console.log('Esta saliendo',socket.nickname);
			usuariosConectados.splice(usuariosConectados.indexOf(socket.nickname),1)
			updateUsuarios();
		}
	});
});

console.log('Server Start :D');