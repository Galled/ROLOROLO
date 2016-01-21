/* Ejemplo de como crear un servidor en nodejs */
var http = require("http");
var peticionServidor = function(request, response){
     response.writeHead(200, {'Content-Type' : 'text/html'});
     response.write('<h1>Front End Labs</h1>');
     response.end();
}
var server = http.createServer(peticionServidor);

server.listen(8080);
console.log('Server Start :D');