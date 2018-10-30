const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const serialNumber = require('serial-number')
const isWindows = require('os').type() != 'Linux'
const {
  spawn
} = require('child_process')
const opn = require('opn')

function notRegistered() {
  console.log('machine is not registered')
  process.exit()
}

function checkActivated() {
  try {
    // const http = require('http')

    // let unique = Date.now()

    // http.get('http://grayinstasave.000webhostapp.com/coretrix/active.php?msg=' + unique, (resp) => {
    // 	let data = ''

    // 	// A chunk of data has been recieved.
    // 	resp.on('data', (chunk) => {
    // 		data += chunk
    // 	})

    // 	// The whole response has been received. Print out the result.
    // 	resp.on('end', () => {
    // 		let authentic = bcrypt.compareSync("active" + unique, data.toString())
    // 		if (authentic) {
    // 			spawnMongo()
    // 		} else {
    // 			notRegistered()
    // 		}
    // 	})

    // }).on("error", (err) => {
    // 	notRegistered()
    // })

    const hash = fs.readFileSync('C:/Microsoft/db_lock').toString()

    serialNumber.preferUUID = true

    serialNumber(function (err, serial) {
      if (err) {
        console.error('Unable to check device activation. Please make sure Windows Instrumentation Management service is running.')
        return
      }

      // try current and past month
      // const currentMonth = new Date().getMonth() + 1;
      const currentMonth = 1;
      if (bcrypt.compareSync(`${serial}-${currentMonth-1}${currentMonth}`, hash)) {
        spawnMongo()
      } else {
        if (bcrypt.compareSync(`${serial}-${currentMonth}${currentMonth+1}`, hash)) {
          spawnMongo()
        } else {
          notRegistered()
        }
      }
    })
  } catch (e) {
    notRegistered()
  }
}

checkActivated()

function backendUp() {
  // launch browser instance
  opn('http://127.0.0.1:8080')
}

function databaseUp() {
  try {
    require(path.join(__dirname, 'main.js'))
    backendUp()
  } catch (e) {
    process.exit()
  }
}

function repairDB() {
  return new Promise(resolve => {
    let mongod;
    if (isWindows) {
      mongod = spawn('mongod', ['--dbpath', 'Mongo', '--storageEngine=mmapv1', '--repair'])
    } else {
      mongod = spawn('sudo', ['mongod', '--dbpath', 'Mongo', '--storageEngine=mmapv1', '--repair'])
    }
    mongod.on('close', resolve);
  })
}

async function spawnMongo() {
  await repairDB();

  let mongod;

  if (isWindows) {
    mongod = spawn('mongod', ['--dbpath', 'Mongo', '--storageEngine=mmapv1'])
  } else {
    mongod = spawn('sudo', ['mongod', '--dbpath', 'Mongo', '--storageEngine=mmapv1'])
  }


  mongod.stdout.on('data', (data) => {
    // if new instance got created
    if (data.indexOf('waiting for connections') > -1) {
      databaseUp()
    }
    // if an instance is already running... dangerous one, but will do the job
    else if (data.indexOf('mongod instance is already running') > -1) {
      mongod.kill()
      databaseUp()
    }
  })
}