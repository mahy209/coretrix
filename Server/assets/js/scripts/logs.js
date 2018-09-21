var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location, sdk) {
    $rootScope.grades_names = sdk.grades_names;
    $rootScope.title = "Coretrix";
    $rootScope.weekdays = [
        'السبت',
        'الاحد',
        'الاثنين',
        'الثلاثاء',
        'الاربعاء',
        'الخميس',
        'الجمعه'
    ];
    $rootScope.NumericOrderStrings = [
        'الأولى',
        'الثانية',
        'الثالثة',
        'الرابعة',
        'الخامسة',
        'السادسة',
        'السابعة'
    ];
    $rootScope.navigate = (link) => {
        if (!link) link = '';
        $window.location.href = '/' + link;
    };
    confirm($rootScope, sdk);
});

function confirm(rootscope, sdk, name) {
    function def() {
        rootscope.navigate();
    }

    function students() {
        rootscope.navigate('app');
    }
    sdk.CheckToken(students, () => { }, def);
}

app.controller("mainCtrl", function ($rootScope, $scope, sdk) {
    var splits = window.location.href.split('/');
    var id = splits[splits.length - 1];
    var parsed = parseInt(id);
    if (typeof parsed != 'undefined' && !isNaN(parsed)) {
        sdk.GetClass(id, (stat, data) => {
            switch (stat) {
                case sdk.stats.OK:
                    loadStuff(data.grade);
                    break;
                default:

            }
        });
    } else {
        $("#selector_2").slideDown();
        loadStuff();
		}
		
		$scope.sendSMS = () => {
			window.open(`/cpanel#tab=sms&type=lesson&grade=${$scope.selected_grade}&class=${$scope.selected_class.id}` , '_blank');
		}

    function loadStuff(grade) {
        sdk.GetGrades((stat, result) => {
            switch (stat) {
                case sdk.stats.OK:
                    $scope.grades = result;
                    if (result.indexOf(grade) > -1) {
                        $scope.selected_grade = grade;
                        $scope.grade_changed(() => {
                            var found = false;
                            for (var i = 0; i < $scope.classes.length; i++) {
                                if ($scope.classes[i].id == id) {
                                    $scope.selected_class = $scope.classes[i];
                                    $scope.reload();
                                    found = true;
                                }
                            }
                            if (!found) toast('لا توجد سجلات بهذه الحصة!', gradients.error);
                        });
                    } else {
                        $scope.selected_grade = result[0];
                        $scope.grade_changed();
                    }
                    break;
                default:

            }
        });
    }
    $scope.compare = (a, b, option) => {
        switch (option) {
            case 'gt':
                return a > b;
            case 'lt':
                return a < b;
            case 'eq':
                return a == b;
        }
    }
    $scope.blurTable = Cookies.get('blurLogsTable') ? (Cookies.get('blurLogsTable') == 'true') : true;
    $scope.setBlurCookie = () => {
        setCookie('blurLogsTable', $scope.blurTable);
    }
    $scope.homeworkMarkSelector = 'gt';
    $scope.quizMarkSelector = 'gt';
    $scope.filterHomeworkType = 'all';
    $scope.filterHomeworkOption = 'all';
    $scope.filterQuizType = 'all';
    $scope.filterQuizOption = 'all';
    $scope.filterQuizMark = 0;
    $scope.filterHomeworkMark = 0;
    $scope.globalHomeworkMax = 10;
    $scope.globalQuizMax = 10;
    $scope.globalHomeworkType = 'none';
    $scope.globalQuizType = 'none';
    $scope.reset = () => {
        $scope.selected_group = null;
    }
    $scope.printPage = () => {
        if ($scope.logs && $scope.logs.length > 0) {
            window.print();
        } else {
            toast('ﻻ توجد سجلات ليتم طباعتها!', gradients.error);
        }
    }
    arrayKeyToArray = (obj, key) => {
        let returner = [];
        obj.forEach(element => {
            returner.push(element[key]);
        });
        return returner;
    }
    dayArrayToString = arr => {
        var str = "";
        arr.forEach(element => {
            if (str == "") str = $rootScope.weekdays[element];
            else str += " و " + $rootScope.weekdays[element];
        });
        return str;
    }
    classesLinksToDayString = obj => {
        return dayArrayToString(arrayKeyToArray(obj, "day"));
    }
    $scope.search = () => {
        if ($scope.searchText) {
            var options = {
                shouldSort: true,
                threshold: 0.2,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "fullname",
                    "codeName"
                ]
            };
            var fuse = new Fuse($scope.loadedLogs, options);
            var result = fuse.search($scope.searchText);
            $scope.logs = result;
        } else {
            $scope.logs = $scope.loadedLogs;
        }
    }
    $scope.setSettings = () => {
        if ($scope.globalQuizType != 'none') {
            for (var i = 0; i < $scope.logs.length; i++) {
                if (!$scope.logs[i].log.quiz) $scope.logs[i].log.quiz = {};
                $scope.logs[i].log.quiz.type = $scope.globalQuizType;
                if ($scope.globalQuizType == 'marks') $scope.logs[i].log.quiz.max = $scope.globalQuizMax;
            }
        }
        if ($scope.globalHomeworkType != 'none') {
            for (var i = 0; i < $scope.logs.length; i++) {
                if (!$scope.logs[i].log.homework) $scope.logs[i].log.homework = {};
                $scope.logs[i].log.homework.type = $scope.globalHomeworkType;
                if ($scope.globalHomeworkType == 'marks') $scope.logs[i].log.homework.max = $scope.globalHomeworkMax;
            }
        }
        //TODO change global settings api call
    }
    $scope.logSearchedAttendance = (e) => {
        if (e.keyCode == 13) {
            $scope.logs[0].log.attendant = !$scope.logs[0].log.attendant;
            $scope.studentAttendanceChanged($scope.logs[0]);
        }
    }
    $scope.reload = () => {
        $scope.loadedLogs = null;
        $scope.logs = null;
        if (!$scope.selected_grade) return toast('لم يتم إختيار السنة!', gradients.error);
        if (!$scope.selected_class) return; //toast('لم يتم إختيار اى حصص!', gradients.error);
        sdk.FetchClassLogs($scope.selected_class.id, $scope.selected_grade, (stat, logs) => {
            if (stat == sdk.stats.OK) {
                for (let i = 0; i < logs.length; i++) {
                    logs[i].codeName = idToCode(logs[i].studentid);
                }
                $scope.loadedLogs = logs;
                $scope.logs = logs;
            }
        });
    };
    $scope.homeworkChanged = (n) => {
        try {
            sdk.LogClass(n.studentid, $scope.selected_class.id, null, null, null, n.log.homework, (stat, result) => {
                if (stat != sdk.stats.OK) {
                    toast('تعذر تعديل واجب الطالب!', gradients.error);
                }
            });
        } catch (e) {
            toast('تعذر تعديل واجب الطالب!', gradients.error);
        }
    }
    $scope.quizChanged = (n) => {
        try {
            sdk.LogClass(n.studentid, $scope.selected_class.id, null, null, n.log.quiz, null, (stat, result) => {
                if (stat != sdk.stats.OK) {
                    toast('تعذر تعديل تسميع الطالب!', gradients.error);
                }
            });
        } catch (e) {
            toast('تعذر تعديل تسميع الطالب!', gradients.error);
        }
    }
    $scope.studentAttendanceChanged = (n) => {
        try {
            sdk.LogClass(n.studentid, $scope.selected_class.id, null, n.log.attendant, null, null, (stat, result) => {
                if (stat != sdk.stats.OK) {
                    toast('تعذر تعديل حضور الطالب!', gradients.error);
                }
            });
        } catch (e) {
            toast('تعذر تعديل حضور الطالب!', gradients.error);
        }
    };
    $scope.studentGroupChanged = (n) => {
        try {
            sdk.LogClass(n.studentid, $scope.selected_class.id, n.log.groupid, null, null, null, (stat, result) => {
                if (stat != sdk.stats.OK) {
                    toast('تعذر تغيير مجموعة الطالب!', gradients.error);
                }
            });
        } catch (e) {
            toast('تعذر تغيير مجموعة الطالب!', gradients.error);
        }
    };
    $scope.grades_names = sdk.grades_names_long;
    $('.datepicker').datepicker({
        todayHighlight: true
    });
    $scope.addClass = () => {
        sdk.InitializeClass($scope.selected_grade, new Date($('#class_date').val()), $scope.selected_classnum, $scope.addedClass, (stat, newid) => {
            if (stat == sdk.stats.OK) {
                $scope.grade_changed();
                toast('تم إضافة الحصة بنجاح');
            }
        });
    };
    $scope.prepareClassDel = () => {
        if ($scope.selected_class) $('#deleteClass_modal')[0].M_Modal.open()
        else toast('لم تختار أى حصة!', gradients.error);
    }
    $scope.delete_class = () => {
        sdk.DeleteClass($scope.selected_class.id, (stat) => {
            if (stat == sdk.stats.OK) {
                $scope.grade_changed();
                $scope.loadedLogs = null;
                $scope.logs = null;
                toast('تم حذف الحصة بنجاح!');
            }
        });
    }
    $scope.grade_changed = (callback) => {
        if ($scope.selected_grade) {
            sdk.ListGroups(parseInt($scope.selected_grade), (stat, groups) => {
                switch (stat) {
                    case sdk.stats.OK:
                        $scope.groups = groups;
                        $scope.groupsIds = [];
                        $scope.groupsNames = {};
                        for (var i = 0; i < groups.length; i++) {
                            $scope.groupsIds.push(groups[i].id);
                            $scope.groupsNames[groups[i].id] = groups[i].name;
                        }
                        break;
                    default:
                }
            });
            sdk.ListClasses(parseInt($scope.selected_grade), (stat, result) => {
                switch (stat) {
                    case sdk.stats.OK:
                        for (var i = 0; i < result.length; i++) {
                            result[i].date = simpleDate(new Date(result[i].date));
                            if (result[i].links) result[i].linksString = classesLinksToDayString(result[i].links);
                        }
                        $scope.classes = result;
                        if (callback) callback();
                        break;
                    default:
                }
            });
            sdk.CountGroupsLinks(parseInt($scope.selected_grade), (stat, count) => {
                switch (stat) {
                    case sdk.stats.OK:
                        $scope.classesLinks = [];
                        for (let i = 0; i < count; i++) {
                            $scope.classesLinks.push(i);
                        }
                        break;
                    default:
                        break;
                }
            })
        }
    };
});
