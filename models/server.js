const express = require('express');
const cors = require('cors');
const path = require('path');

const {socketController}=require("../sockets/controller")

const {InitDB}=require("./database")

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);
        InitDB()

		this.paths = {};

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();

		this.sockets();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Directorio Público
		this.app.use('/', express.static('public'));
		this.app.use('/css', express.static('node_modules'));
	}

	routes() {
		//this.app.use( this.paths.auth, require('../routes/auth'));
	}

	sockets() {
		this.io.on('connection', socketController)
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log('Servidor corriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
