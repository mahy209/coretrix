var coretrixLanguages = angular.module("coretrix.languages", []);
var langs = [];
coretrixLanguages.factory('languages', [function() {
    var ls = {
        arabic: {
            coretrix: "كورتركس",
            demo: "نسخة تجريبية",
            login: "تسجيل دخول",
            forgotpassword: "نسيت كلمة المرور ؟",
            password: "كلمة المرور",
            usernameoremail: "اسم المستخدم أو البريد الإلكترونى",
            register: "تسجيل",
            wronguseremailpass: "بيانات خاطئة",
            register: "تسجيل",
            registernav: "تسجيل <"
        },
        english: {
            grades: [
                'Kinder Garten 1',
                'Kinder Garten 2',
                'Primary 1',
                'Primary 2',
                'Primary 3',
                'Primary 4',
                'Primary 5',
                'Primary 6',
                'Elementary 1',
                'Elementary 2',
                'Elementary 3',
                'Secondary 1',
                'Secondary 2',
                'Secondary 3'
            ],
            coretrix: "Coretrix",
            demo: "demo",
            login: "Log In",
            forgotpassword: "Forgot Password ?",
            password: "Password",
            usernameoremail: "Username Or E-mail",
            register: "Register",
            wronguseremailpass: "Wrong Username/E-mail Or Password!",
            register: "Register",
            registernav: "Register >",
            username: "Username",
            displayname: "Display Name",
            email: "E-Mail"
        }
    };
    langs = Object.keys(ls);
    return ls;
}])
