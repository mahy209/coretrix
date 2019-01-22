var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location) {
    $rootScope.title = "Coretrix";
    $rootScope.navigate = (link) => {
        if (!link) link = '';
        window.open('/' + link, '_self')
    };
});

app.controller("parentCtrl", function ($rootScope, $scope, sdk) {
    function submit(code) {
        sdk.RequestParentToken(code.toUpperCase(), (stat, token) => {
            switch (stat) {
                case sdk.stats.OK:
                    $rootScope.navigate('profile/parent/' + token);
                    break;
                case sdk.stats.UserNonExisting:
                    toast('الطالب غير موجود!', gradients.error);
                    break;
                default:
                    toast('تعذر تحميل بيانات الطالب!', gradients.error);
                    break;
            }
        });
    }
    $scope.submit = submit;
    $scope.enter = (e) => {
        if (e.keyCode == 13) submit($scope.code);
    }
    let scanner = new Instascan.Scanner({
        video: document.getElementById('preview')
    });
    scanner.addListener('scan', function (content) {
        try {
            var parsed = JSON.parse(content);
        } catch (e) { toast('هذا كود ﻻ يخص البرنامج!', gradients.error) }
        if (!isNaN(parsed.id)) {
            submit(parsed.code);
        }
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });

});
