var sharp = null //TODO require('sharp');

module.exports = {
    _defaultThumbnailSize: 300,
    isValid: function(path, callback) {
        sharp(path).resize(1).toBuffer(function(_, _, info) {
            if (info) callback(true);
            else callback(false);
        });
    },
    Thumbnail: function(path, output, callback, size) {
        sharp(path).resize((typeof size == 'number') ? size : module.exports._defaultThumbnailSize).jpeg().toFile(output, function(err, info) {
            if (err) throw err;
            else callback({size: info.size, format: info.format});
        });
    }
}
