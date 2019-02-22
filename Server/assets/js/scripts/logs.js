var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location, sdk) {
  $rootScope.title = "Coretrix";
  $rootScope.quizNames = quizNames;
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
  $rootScope.grades_names = {};
  sdk.ListGrades((stat, result) => {
    switch (stat) {
      case sdk.stats.OK:
        $rootScope.sdkGrades = result;
        const grades = result.map(grade => grade.id);
        result.forEach(grade => {
          $rootScope.grades_names[grade.id] = grade.name;
        });
        break
      default:
    }
  })
  confirm($rootScope, sdk);
});

function confirm(rootscope, sdk, name) {
  function def() {
    rootscope.navigate();
  }

  function students() {
    rootscope.navigate('app');
  }
  sdk.CheckToken(students, () => {}, def);
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
    window.open(`/cpanel#tab=sms&type=lesson&grade=${$scope.selected_grade}&class=${$scope.selected_class.id}`, '_blank');
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

  $scope.barcodeAttendanceCheck = false;
  barcodeScanner((code) => {
    $scope.$apply(() => {
      $scope.searchText = code;
      $scope.search(code);
      if ($scope.barcodeAttendanceCheck) {
        setTimeout(() => {
          $scope.logSearchedAttendance(null, true);
        }, 100);
      }
    });
  });

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
  $scope.globalAttendanceCheck = 'none';
  $scope.globalHomeworkOption = 'none';
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
  $scope.search = (query) => {
    if (query) {
      let result = $scope.loadedLogs.find(log => log.studentid == query);
      $scope.searchText = result.fullname;
      $scope.logs = [result];
    } else if ($scope.searchText) {
      let result = $scope.fuse.search($scope.searchText);
      $scope.logs = result;
    } else {
      $scope.logs = $scope.loadedLogs;
    }
  }
  $scope.setSettings = () => {
    for (var i = 0; i < $scope.logs.length; i++) {
      if ($scope.globalQuizType != 'none') {
        // Make sure `quiz` object exists
        if (!$scope.logs[i].log.quiz) $scope.logs[i].log.quiz = {};
        // Set type, max
        $scope.logs[i].log.quiz.type = $scope.globalQuizType;
        if ($scope.globalQuizType == 'marks') $scope.logs[i].log.quiz.max = $scope.globalQuizMax;
        // Set global quiz option if specified
        if ($scope.globalQuizOption != 'none') $scope.logs[i].log.quiz.option = $scope.globalQuizOption;
        // Only save if a mark is already set
        // Or a general: `value` is set
        if (
          ($scope.logs[i].log.quiz.type == 'marks' && $scope.logs[i].log.quiz.mark >= 0) ||
          ($scope.logs[i].log.quiz.type == 'general' && $scope.logs[i].log.quiz.option)) {
          $scope.quizChanged($scope.logs[i]);
        }
      }
      if ($scope.globalHomeworkType != 'none') {
        // Make sure `homework` exists
        if (!$scope.logs[i].log.homework) $scope.logs[i].log.homework = {};
        // Set type, max
        $scope.logs[i].log.homework.type = $scope.globalHomeworkType;
        if ($scope.globalHomeworkType == 'marks') $scope.logs[i].log.homework.max = $scope.globalHomeworkMax;
        // Set global homework option if specified
        if ($scope.globalHomeworkOption != 'none') $scope.logs[i].log.homework.option = $scope.globalHomeworkOption;
        // Only save if a mark is already set
        // Or a general: `value` is set
        if (
          ($scope.logs[i].log.homework.type == 'marks' && $scope.logs[i].log.homework.mark >= 0) ||
          ($scope.logs[i].log.homework.type == 'general' && $scope.logs[i].log.homework.option)) {
          $scope.homeworkChanged($scope.logs[i]);
        }
      }

      if ($scope.globalAttendanceCheck != 'none') {
        switch ($scope.globalAttendanceCheck) {
          case 'setTrue':
            $scope.logs[i].log.attendant = true;
            break;
          case 'setFalse':
            $scope.logs[i].log.attendant = false;
            break;
        }
        $scope.studentAttendanceChanged($scope.logs[i]);
      }
    }
  }
  $scope.logSearchedAttendance = (e, auto) => {
    if (auto || e.keyCode == 13) {
      $scope.logs[0].log.attendant = true;
      $scope.studentAttendanceChanged($scope.logs[0]);
    }
  }
  $scope.reload = () => {
    $scope.loadedLogs = null;
    $scope.fuse = new Fuse([], {});
    $scope.logs = null;
    if (isNaN($scope.selected_grade)) return toast('لم يتم إختيار السنة!', gradients.error);
    if (!$scope.selected_class) return; //toast('لم يتم إختيار اى حصص!', gradients.error);
    sdk.FetchClassLogs($scope.selected_class.id, $scope.selected_grade, (stat, logs) => {
      if (stat == sdk.stats.OK) {
        for (let i = 0; i < logs.length; i++) {
          logs[i].codeName = idToCode(logs[i].studentid);
        }
        $scope.loadedLogs = logs;
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
        $scope.fuse = new Fuse(logs, options);
        $scope.logs = logs;
      }
    });
  };
  $scope.homeworkChanged = (n) => {
    try {
      if (n.log.homework.type == 'marks' && (isNaN(n.log.homework.mark) || isNaN(n.log.homework.max))) return;
      if (n.log.homework.type == 'general' && (n.log.homework.option == null)) return;
      sdk.LogClass(n.studentid, $scope.selected_class.id, null, null, null, n.log.homework, (stat, result) => {
        if (stat == sdk.stats.OK) {
          toast('تم حفظ الدرجة');
        } else {
          toast('تعذر تعديل واجب الطالب!', gradients.error);
        }
      });
    } catch (e) {
      toast('تعذر تعديل واجب الطالب!', gradients.error);
    }
  }
  $scope.quizChanged = (n) => {
    try {
      if (n.log.quiz.type == 'marks' && (n.log.quiz.mark == null || n.log.quiz.max == null || isNaN(n.log.quiz.mark) || isNaN(n.log.quiz.max))) return;
      if (n.log.quiz.type == 'general' && (n.log.quiz.option == null)) return;
      sdk.LogClass(n.studentid, $scope.selected_class.id, null, null, n.log.quiz, null, (stat, result) => {
        if (stat == sdk.stats.OK) {
          toast('تم حفظ الدرجة');
        } else {
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
        if (stat == sdk.stats.OK) {
          toast('تم حفظ الحضور');
        } else {
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
        $scope.fuse = new Fuse([], {});
        $scope.logs = null;
        toast('تم حذف الحصة بنجاح!');
      }
    });
  }
  $scope.grade_changed = (callback) => {
    if (!isNaN($scope.selected_grade)) {
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