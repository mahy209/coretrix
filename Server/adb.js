var adb = require('adbkit')
const {spawn} = require('child_process')
var Promise = require('bluebird')
var client = adb.createClient()

function send (serial, recipient, message) {
  const activity = spawn('adb', [
    '-s',
    serial,
    'shell',
    'am',
    'startservice',
    '-n',
    'com.android.shellms/.sendSMS',
    '-e',
    'contact',
    recipient,
    '-e',
    'msg',
    message
  ])

  activity.on('close', () => { })
}

send('92010f74b01eb453', '01111111259', 'haha')
// send('3004135e96608100', '01111111259', 'fewafwa4f4aw')
