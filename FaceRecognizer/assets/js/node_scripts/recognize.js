const fs = require('fs');
const cv = require('opencv4nodejs')
const fr = require('face-recognition').withCv(cv);
const recognizer = fr.FaceRecognizer();
var data;
try {
    var data = JSON.parse(fs.readFileSync('data'));
} catch (e) {}
if (data) recognizer.load(data);

function getImage(imgbase64) {
    if (!imgbase64) return null;
    try {
        const base64data = imgbase64.replace('data:image/jpeg;base64', '')
            .replace('data:image/png;base64', ''); //Strip image type prefix
        const buffer = Buffer.from(base64data, 'base64');
        return fr.CvImage(cv.imdecode(buffer));
    } catch (e) {
        return null;
    }
}

function recognize(img) {
    img = getImage(img);
    if (!img) return;
    var name = recognizer.predictBest(img).className;
    return name;
}

function train(img, name) {
    img = getImage(img);
    if (!img) return;
    recognizer.addFaces([img], name);
}

function save() {
    var serialized = recognizer.serialize();
    fs.writeFileSync('data', JSON.stringify(serialized));
}
