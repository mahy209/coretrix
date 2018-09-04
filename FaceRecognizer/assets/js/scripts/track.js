training = false;
window.onload = function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var canvas2 = document.getElementById("canvas2");
    var context2 = canvas2.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, {
        camera: true
    });

    var frames = 0;
    var c_rect;
    var vW;
    var vH;
    var hRatio;
    var vRatio;
    tracker.on('track', function(event) {
        if (!vW) vW = video.videoWidth;
        if (!vH) vH = video.videoHeight;
        if (!hRatio) hRatio = vW / canvas.width;
        if (!vRatio) vRatio = vH / canvas.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            if (!rect) return;
            c_rect = rect;
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#ffffff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            getImage();
        });
    });
    var getImage = function() {
        if (!c_rect) return;
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        context2.drawImage(video, c_rect.x * hRatio, c_rect.y * vRatio, c_rect.width * hRatio, c_rect.height * vRatio, 0, 0, c_rect.width, c_rect.height);
        if (training) {
            var trainingName = $('#name').val();
            train(canvas2.toDataURL(), trainingName);
            frames++;
            $('#trainedframes').text(`trained: ${trainingName} with ${frames} frames`);
        } else {
            var recName = recognize(canvas2.toDataURL());
            $('#recognized').text(recName);
        }
    };
    $('#train').click(() => {
        if (!training) {
            frames = 0;
        } else {
            save();
        }
        training = !training;
    });
};
