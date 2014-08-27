var socket = io.connect('/');
$(function(){
	
	/*
	socket.on('message_event',function(data){
		console.log(data.contador);
		$('#message').html('# de usuarios conectados:' + data.contador);

	});
	$('#form').submit(function(){
		socket.emit('enviando mensaje',{text:$('.mensaje').val()});
		return false;
	});
	socket.on('recibiendo mensaje',function(data){
		$("#form").after('<p>'+data.text+'</p>');
	});
	
	socket.on('ping',function(data){
		console.log('recibido PING. Enviando PONG...');
		socket.emit('pong',{text:'PONG'});
	});
	socket.on('pong',function(data){
		console.log('recibido PONG response. PONG');
	});
	$('#ping').click(function(){
		console.log('Enviando PING al servidor...');
		socket.emit('ping',{text:'PING'});
	});
	*/

	var nickname = $('#nickname');
	var setnicknameform = $('#set-nickname');
	setnicknameform.submit(function(e){
		e.preventDefault();
		socket.emit('nickname',nickname.val(),function(data){
			//console.log(data);
			if(data){
				console.log('nickname añadido correctamente');
				setnicknameform.hide();
				$('#send-message').show();
			}
			else{
				setnicknameform.prepend($('<p>').text('nickname ya tomado, elige otro..!'));
			}
		});
		return false;
	});
	socket.on('nicknames',function(data){
		$('#nicknames').empty().append('<ul>');
		for (var i = 0; i < data.length; i++) {
			$('#nicknames ul').append('<li>'+data[i]+'</li>');
		}
	});
	$('#send-message').submit(function(){
		socket.emit('user message',$('#message').val());
		$('#message').val('').focus();
		return false;
	});
	socket.on('user message',function(data){
		$('#messages').append($('<p>').append($('<strong>').text(data.nick),data.message));
	});
});

