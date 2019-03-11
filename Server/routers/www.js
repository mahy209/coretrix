const express = require('express');
var router = express.Router();

function registerSimplePage(path, view) {
    router.get(path, function(req, res) {
        res.render(view);
    })
}

registerSimplePage('/', 'main.html');
registerSimplePage('/login', 'main.html');
//registerSimplePage('/register', 'main.html');
registerSimplePage('/parent', 'parent.html');
registerSimplePage('/stats', 'stats.html');
registerSimplePage('/cpanel', 'cpanel.html');
registerSimplePage('/profile/*', 'report.html');
registerSimplePage('/profile/parent/*', 'report.html');
registerSimplePage('/logs', 'logs.html');
registerSimplePage('/logs/*', 'logs.html');
registerSimplePage('/exam_logs', 'exam_logs.html');
registerSimplePage('/exam_logs/*', 'exam_logs.html');
registerSimplePage('/payments', 'payinglogs.html');
registerSimplePage('/payments/*', 'payinglogs.html');
registerSimplePage('/app', 'app.html');
registerSimplePage('/qrselector', 'qrselector.html');
registerSimplePage('/printer', 'printer.html');
registerSimplePage('/batch', 'batch.html');

module.exports = router;
