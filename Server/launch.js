const path = require('path');
const isWindows = require('os').type() != 'Linux';

function notRegistered() {
    console.log('machine is not registered');
    process.exit();
}

if (isWindows) {
    const regedit = require(path.join(process.cwd(), './regedit'));
    try {
        regedit.list('HKLM\\SOFTWARE\\g', function (err, result) {
            if (err) notRegistered();
            else {
                try {
                    if (result['HKLM\\SOFTWARE\\g'].values.o.value == 'o') {
                        console.log('machine is registered');
                    } else notRegistered();
                } catch (e) {
                    notRegistered();
                }
            }
        })
    } catch (e) {
        notRegistered();
    }
}

const { spawn } = require('child_process');
const opn = require('opn');
const snapshot_path = path.dirname(process.pkg.entrypoint);

function backendUp() {
    // launch browser instance
    opn('http://localhost:8080');
}

function databaseUp() {

    const node = spawn('node', [path.join(snapshot_path, 'main.js')]);

    node.stdout.on('data', (data) => {
        data = data.toString();
        if (data.indexOf('magician') > -1) {
            backendUp();
        } else if (data.indexOf('EADDRINUSE') > -1) {
            node.kill();
            backendUp();
        }
    });

}

function repairDB() {
    return new Promise(resolve => {
        let repair = spawn('mongod', ['--dbpath', 'Mongo', '--storageEngine=mmapv1', '--repair']);

        repair.stdout.on('data', (data) => {
            data = data.toString();
            if (data.indexOf('closeAllFiles() finished') > -1) {
                resolve("resolved");
            }
        })
    });
}
// run mongod
let mongod;
async function spawnMongo() {
    if (isWindows) {
        if (process.arch == 'x64') mongod = spawn('mongod', ['--dbpath', 'Mongo']);
        else {
            let result = await repairDB();
            mongod = spawn('mongod', ['--dbpath', 'Mongo', '--storageEngine=mmapv1'])
        }
    } else
        mongod = spawn('sudo', ['mongod', '--dbpath', 'Mongo']);


    mongod.stdout.on('data', (data) => {
        data = data.toString();
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
