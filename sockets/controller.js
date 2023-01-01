const {
	GetAllPlayers,
	GetPlayerByName,
	AddPlayer,
	UpdateMountPlayer,
} = require('../models/database');

var uuidPlayers = new Map();

const socketController = (socket) => {
	console.log('Cliente conectado', socket.id);
	GetAllPlayers((players) => {
		socket.emit('get-players', players);
	});

	socket.on('disconnect', () => {
		console.log('Cliente desconectado', socket.id);
		socket.broadcast.emit('get-players', 'df');
	});

	socket.on("pagar",(playload,callback)=>{
		console.log("El jugador",playload.NamePlayer,"pago a",playload.nombre,"un total de:",playload.monto)
		GetPlayerByName(playload.nombre, (players) => {
			let monto=parseInt(players[0].monto)
			monto+=parseInt(playload.monto);
			UpdateMountPlayer(playload.nombre,monto,(newMount)=>{
			
				socket.to(playload.uuid).emit('pagado',{newMount})

				GetPlayerByName(playload.NamePlayer,(player)=>{
					let monto=parseInt(player[0].monto)
					monto-=parseInt(playload.monto);
					UpdateMountPlayer(playload.NamePlayer,monto,(newMount)=>{
						callback({newMount})
					})
				})
			});
			
		});
	})

	socket.on('login', (playload, callback) => {
		GetPlayerByName(playload.name, (players) => {
			if (players.length > 0) {
				uuidPlayers.set(players[0].nombre, socket.id);

				callback({
					uuidPlayers: converMapToArray(uuidPlayers),
					monto: players[0].monto,
				});
				socket.broadcast.emit('login', {
					uuidPlayers: converMapToArray(uuidPlayers),
				});
			} else {
				AddPlayer(playload.name, (lastID) => {
					uuidPlayers.set(playload.name, socket.id);
					callback({ uuidPlayers: converMapToArray(uuidPlayers) });
					socket.broadcast.emit('login', {
						uuidPlayers: converMapToArray(uuidPlayers),
					});
				});
			}
		});
	});

	function converMapToArray(map) {
		let arr = [];
		map.forEach((value, key) => {
			arr.push({ [key]: value });
		});
		return arr;
	}

	socket.on('send-msj', (payload, callback) => {
		//socket.broadcast.emit('send-msj', payload);//para enviar mensaje a todos menos a uno mismo
		console.log(payload);
		GetAllPlayers((players) => {
			console.log(players);
		});
		const id = 1234;
		callback(payload);
		//socket.to(payload.id).emit('mensaje-privado',{de:payload.mensaje})
	});
};

module.exports = {
	socketController,
};
