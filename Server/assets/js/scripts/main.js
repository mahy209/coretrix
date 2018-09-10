var app = angular.module("coretrix", ['coretrix.sdk'])

const animations = {
    wrong: 'shake'
}

app.run(function ($rootScope, $window, $location) {
    $rootScope.title = "Coretrix";
    $rootScope.navigate = (link) => {
        if (!link) link = '';
        $window.location.href = '/' + link;
    };
    $rootScope.path = (link) => {
        if (!link) link = '';
        $location.path('/' + link);
    };
    $rootScope.animate = (id, animation) => {
        var cs = 'animated ' + animation;
        id = '#' + id;
        $(id).addClass(cs);
        setTimeout(() => {
            $(id).removeClass(cs);
        }, 1000);
    }
});

let goIn;

app.controller("loginCtrl", function ($scope, $rootScope, $window, sdk) {
    $scope.auth = function () {
        var model = detect.parse(navigator.userAgent);
        function loading(value) {
            $scope.form_scale = value;
            $scope.preloader_active = value;
        }
        function login_wrong(value) {
            if (!value) {
                $rootScope.animate('login_alert', 'shake');
                $scope.login_wrong = true;
            } else $scope.login_wrong = false;
        }

        function password_wrong(value) {
            if (!value) {
                $rootScope.animate('password_alert', 'shake');
                $scope.password_wrong = true;
            } else $scope.password_wrong = false;
        }
        login_wrong(sdk.validators.ValidateString($scope.login));
        password_wrong(sdk.validators.ValidatePassword($scope.password));
        if (!$scope.login_wrong && !$scope.password_wrong) {
            loading(true);
            sdk.Authorize($scope.login, $scope.password, 'web', model, function (stat, result) {
                loading(false);
                switch (stat) {
                    case sdk.stats.OK:
                        Cookies.set("token", result, {
                            path: '/'
                        });
                        $window.location.href = '/';
                        break;
                    case sdk.stats.UserNonExisting:
                        login_wrong();
                        break;
                    case sdk.stats.WrongPassword:
                        password_wrong();
                        break;
                    default:
                        break;
                }
            });
        }
    };
    // local stuff
    goIn = () => {
        $scope.login = "root";
        $scope.password = "123456789";
        $scope.auth();
    }
    // call after goIn is defined
    confirm($rootScope, sdk);
});

app.controller("registerCtrl", function ($scope, sdk, $rootScope) {
    confirm($rootScope, sdk, 'register');
    $rootScope.switch_to = "login";
    $rootScope.switchPages = function () {
        $rootScope.path("login");
    };
    $scope.usertype = 'student';
    $scope.typeStudent = () => {
        $scope.usertype = 'student';
    }
    $scope.typeTeacher = () => {
        $scope.usertype = 'teacher';
    }
    $scope.register = function () {
        function loading(value) {
            $scope.form_scale = value;
            $scope.preloader_active = value;
        }

        function username_wrong(value) {
            if (!value) {
                $rootScope.animate('username_alert', 'shake');
                $scope.username_wrong = true;
            } else $scope.username_wrong = false;
        }

        function password_wrong(value) {
            if (!value) {
                $rootScope.animate('password_alert', 'shake');
                $scope.password_wrong = true;
            } else $scope.password_wrong = false;
        }

        function displayname_wrong(value) {
            if (!value) {
                $rootScope.animate('displayname_alert', 'shake');
                $scope.displayname_wrong = true;
            } else $scope.displayname_wrong = false;
        }

        function email_wrong(value) {
            if (!value) {
                $rootScope.animate('email_alert', 'shake');
                $scope.email_wrong = true;
            } else $scope.email_wrong = false;
        }
        username_wrong(sdk.validators.ValidateString($scope.username));
        displayname_wrong(sdk.validators.ValidateString($scope.displayname));
        email_wrong(sdk.validators.ValidateEmail($scope.email));
        password_wrong(sdk.validators.ValidatePassword($scope.password));
        if (!$scope.username_wrong && !$scope.password_wrong && !$scope.email_wrong && !$scope.displayname_wrong) {
            loading(true);
            sdk.Register($scope.displayname, $scope.username, $scope.password, $scope.email, 'student', function (stat, result) {
                loading(false);
                switch (stat) {
                    case sdk.stats.OK:
                        $rootScope.path("login/" + $scope.username);
                        break;
                    case sdk.stats.Exists:
                        email_wrong(result[0]);
                        username_wrong(result[1]);
                        break;
                    default:
                        console.log(stat);
                }
            });
        }
    }
});

function confirm(rootscope, sdk, name) {
    function def() {
        rootscope.showview = true;
        goIn();
    }

    function teacher() {
        rootscope.navigate("cpanel");
        rootscope.showview = true;
    }

    function students() {
        rootscope.navigate('app');
        rootscope.showview = true;
    }
    sdk.CheckToken(students, teacher, def);
}
