const regedit = require('regedit');

function notRegistered() {
    console.log('machine is not registered');
    process.exit();
}

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