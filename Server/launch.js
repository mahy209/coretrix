const path = require('path');
const fs = require('fs');
const isWindows = require('os').type() != 'Linux';

function notRegistered() {
	console.log('machine is not registered');
	process.exit();
}

function checkActivated() {
	try {
		const code = fs.readFileSync('C:/Microsoft/db_lock').toString();
		if (code != 'QJxkZhgR7dmAThThQhdAsTP8JXWZUkxuhZAv8TX5wVYy6RVJjbWGkNTJSQQCnH4hyRXT5c2VhWvZKjnncq3Y4SFsV9stdAABc2RcysqRzACH7xvfLnngsaQb7emqBKxATc2b49GTHuKWDM4DjVgJZmwEb78ZcHpZVtQ3ffdmDZyNar9fHH5Afc64Tc53Tv2k2yqgu7dh7pqLTEGnRRVzn5zNAuGxBFd3NrCWMMgJJ2QrwHtXJV2587RzbKMGQeNvEGv9hSer9ar7FpkpaP7uuZjjuZKegsAYYXNayRswRekwCqzc4e9Hx3yZs5RcWvQj') {
			notRegistered();
		}
	} catch (e) {
		notRegistered();
	}
}

checkActivated();

const {
	spawn
} = require('child_process');
const opn = require('opn');
const snapshot_path = __dirname;

function backendUp() {
	// launch browser instance
	opn('http://localhost:8080');
}

function databaseUp() {

	try {
		require(path.join(__dirname, 'main.js'));
		backendUp();
	} catch (e) {
		process.exit();
	}

}

// run mongod
let mongod;
async function spawnMongo() {
	if (isWindows) {
		mongod = spawn('mongod', ['--dbpath', 'Mongo']);
	} else {
		mongod = spawn('sudo', ['mongod', '--dbpath', 'Mongo']);
	}

	mongod.stdout.on('data', (data) => {
		// if new instance got created
		if (data.indexOf('waiting for connections') > -1) {
			databaseUp();
		}
		// if an instance is already running... dangerous one, but will do the job
		else if (data.indexOf('mongod instance is already running') > -1) {
			mongod.kill();
			databaseUp();
		}
	});
}

spawnMongo();