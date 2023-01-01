const sqlite3 = require('sqlite3');
const fs = require('fs');
const DB_NAME = 'database.db';

var db;

function createDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Base de datos creada');
	});
}

function InitDB() {
	if (existDB()) {
		ConnectDB();
	} else {
		createDB();
		ConnectDB();
	}
	CreateTablePlayer();
}

function ConnectDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
		}
	});
	console.log('conectado a la base de datos');
}

function existDB() {
	return fs.existsSync(DB_NAME);
}

function CloseDB() {
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Se Cerro la conexion con la base de datos');
	});
}

function CreateTablePlayer() {
	db.run(
		`CREATE TABLE IF NOT EXISTS jugador (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        monto INTEGER
    )`,
		(err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Tabla jugador Creada');
		}
	);
}

function AddPlayer(name, callback) {
	db.run(`INSERT INTO jugador (nombre,monto) VALUES (?,0)`, [name], (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log(`Fila insertada ${this.lastID}`);
		callback(this.lastID);
	});
}

function GetPlayerByName(name, callback) {
	db.all(`SELECT * FROM jugador WHERE nombre=?`, name, (err, rows) => {
		if (err) {
			console.error(err.message);
		}
		callback(rows);
	});
}

function UpdateMountPlayer(name, mount, callback) {
	db.run(
		`UPDATE jugador SET monto =? WHERE nombre=?`,
		[mount, name],
		(err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('fila actualizada');
            callback(mount)
		}
	);
}

function GetAllPlayers(callback) {
	db.all(`SELECT * FROM jugador`, (err, rows) => {
		if (err) {
			console.error(err.message);
		}
		callback(rows);
	});
}

module.exports = {
	InitDB,
	CloseDB,
	AddPlayer,
	GetAllPlayers,
	GetPlayerByName,
	UpdateMountPlayer,
};
