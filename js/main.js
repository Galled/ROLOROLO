var nombre;
var arrayNames = [];
var websocket = io.connect();

function encodedStr(text){ 
	return text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
	return '&#'+i.charCodeAt(0)+';';
	})
};


function repetirNombre(){
	$('#setNombre').fadeIn();
}

function sendNames(){

	var nombre = htmlentities($('#name').val());
	
	$('#setNombre').fadeOut();
		
	if(localStorage){
		localStorage.nombreChatUsuario = nombre;
	}
	websocket.emit('eventoEnviarNombre',nombre);
	
}

function sendMessage(){
	var msg = htmlentities($('#msg').val());
	
	websocket.emit('eventoEnviarMensaje', msg);

}

function procesarMensaje(data){
	console.log('procesarMensaje');
	console.log(data);
	$('#chatInsite').append($('<p>').html('<span>'+data[0]+' dice: </span> ' + data[1]));
	$('#chat').animate({scrollTop: $('#chatInsite').height()},800);
}


function procesarUsuarios(data){
	console.log(data);
	$('#users').html('');
	for (i = 0; i < data.length; i++) { 
	
		$('#users').append($('<p>').html(data[i]));
		
		arrayNames[i] = data[i];
	}
}

function iniciar(){
	$('#body').css({height:screen.height, width:screen.width});
	
	var pantallas = [$('#setNombre')];
	
	$('#formNombre').on('submit', function(e){
		e.preventDefault();
		var flag = 0;
		var nombreAyuda = htmlentities($('#name').val());
		
		for(var i =0; i<arrayNames.length; i++){
			if(nombreAyuda == arrayNames[i])
				flag= 1;
		}
		
		if(flag==0)
			sendNames();
		else
			alert('Este nombre ya existe');
	});
	
	$('#formMsg').on('submit', function(e){
		e.preventDefault();
		sendMessage();
	});
	
	
	if(localStorage){
		if(!(!localStorage.nombreChatUsuario)){
			$('#name').val(localStorage.nombreChatUsuario);
		} 
	}
	
	//Manejar las funciones que vienen del servidor
	
	websocket.on('procesaMensaje', procesarMensaje);
	websocket.on('procesaUsuarios', procesarUsuarios);
	websocket.on('errorName', repetirNombre);
	
	websocket.emit('eventoInicio');
}

$(document).on('ready',iniciar);
