var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location, sdk) {
  $rootScope.grades_names = {};
  $rootScope.title = "Coretrix";
  $rootScope.navigate = (link) => {
    if (!link) link = '';
    $window.location.href = '/' + link;
  };
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
  $scope.newExam_max = 30;
  $scope.newExam_redline = 25;
  $scope.filterLogs = false;
  $scope.filterMark = 25;
  $scope.filterMarkSelector = 'lt';
  $scope.blurTable = Cookies.get('blurLogsTable') ? (Cookies.get('blurLogsTable') == 'true') : true;
  $scope.setBlurCookie = () => {
    setCookie('blurLogsTable', $scope.blurTable);
  }
  var splits = window.location.href.split('/');
  var id = splits[splits.length - 1];
  var parsed = parseInt(id);
  if (typeof parsed != 'undefined' && !isNaN(parsed)) {
    sdk.GetExam(id, (stat, data) => {
      switch (stat) {
        case sdk.stats.OK:
          loadStuff(data.grade);
          break;
        default:

      }
    });
  } else {
    $("#exam_selector").slideDown("slow");
    loadStuff();
  }

  $scope.setGlobalAttendance = () => {
    for (let i = 0; i < $scope.logs.length; i++) {
      $scope.logs[i].log.attendant = $scope.globalAttendanceCheck;
      $scope.attendanceChanged($scope.logs[i]);
    }
  }

  $scope.sendSMS = () => {
    window.open(`/cpanel#tab=sms&type=exam&grade=${$scope.selected_grade}&exam=${$scope.selected_exam.id}`, '_blank');
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
              for (var i = 0; i < $scope.exams.length; i++) {
                if ($scope.exams[i].id == id) {
                  $scope.selected_exam = $scope.exams[i];
                  $scope.reload();
                  found = true;
                }
              }
              if (!found) toast('لا توجد سجلات بهذا الإمتحان!', gradients.error);
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
  $scope.addExam = () => {
    if ($scope.newExam_name == null) return toast('من فضلك قم بإدخال اسم الإمتحان', gradients.error)
    if ($scope.addExam_selectedGrade == null) return toast('من فضلك قم بإختيار السنة', gradients.error)
    sdk.AddExam($scope.newExam_name, parseInt($scope.addExam_selectedGrade), $scope.newExam_max, (stat) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.grade_changed();
          toast('تم إضافة الإمتحان بنجاح!');
          break;
        default:
          toast('تعذر إضافة الإمتحان!', gradients.error);
      }
      $('#addExam_modal')[0].M_Modal.close();;
    });
  }
  $scope.printPage = () => {
    if ($scope.logs && $scope.logs.length > 0) {
      window.print();
    } else {
      toast('ﻻ توجد سجلات ليتم طباعتها!', gradients.error);
    }
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
  $scope.reload = () => {
    if (!$scope.selected_grade) return toast('لم يتم إختيار السنة!', gradients.error);
    if (!$scope.selected_exam) return; //toast('لم يتم إختيار اى إمتحانات!', gradients.error);
    sdk.FetchExamLogs($scope.selected_exam.id, $scope.selected_grade, (stat, logs) => {
      if (stat == sdk.stats.OK) {
        for (let i = 0; i < logs.length; i++) {
          logs[i].codeName = idToCode(logs[i].studentid);
        }
        $scope.loadedLogs = logs;
        $scope.logs = logs;
      }
    });
  };
  $scope.addExam = () => {
    if ($scope.newExam_name == null) return toast('من فضلك قم بإدخال اسم الإمتحان', gradients.error)
    if ($scope.addExam_selectedGrade == null) return toast('من فضلك قم بإختيار السنة', gradients.error)
    sdk.AddExam($scope.newExam_name, parseInt($scope.addExam_selectedGrade), $scope.newExam_max, $scope.newExam_redline, (stat) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.grade_changed();
          toast('تم إضافة الإمتحان بنجاح!');
          break;
        default:
          toast('تعذر إضافة الإمتحان!', gradients.error);
      }
      $('#addExam_modal')[0].M_Modal.close();;
    });
  }
  $scope.editExam = () => {
    if (!$scope.editExam_name) return toast('برجاء كتابة اسم الإمتحان!', gradients.error);
    if (!$scope.editExam_max) return toast('برجاء إدخال أعلى درجة للإمتحان!', gradients.error);
    if (!$scope.editExam_redline) return toast('برجاء إدخال الخط الأحمر للدرجات!', gradients.error);
    sdk.EditExam($scope.loadedExamId, $scope.editExam_name, $scope.editExam_max, $scope.editExam_redline, (stat) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed();
        toast('تم تعديل الإمتحان بنجاح!');
      } else toast('تعذر تعديل الإمتحان!', gradients.error);
      $('#editExam_modal')[0].M_Modal.close();
    });
    $scope.loadedExamId = null;
  }
  $scope.loadExam = (exam) => {
    sdk.GetExam(exam.id, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.editExam_name = result.name;
          $scope.editExam_max = result.max;
          $scope.editExam_redline = result.redline;
          $scope.loadedExamId = exam.id;
          $('#editExam_modal')[0].M_Modal.open();
          break;
        default:
          toast('تعذر تحميل بيانات الإمتحان!', gradients.error);
      }
    });
  }
  $scope.markChanged = (n) => {
    try {
      sdk.LogExam(n.studentid, $scope.selected_exam.id, null, n.log.mark, (stat, result) => {
        if (stat == sdk.stats.OK) {
          toast('تم حفظ الدرجة');
        } else {
          toast('تعذر تعديل حضور الطالب!', gradients.error);
        }
      });
    } catch (e) {
      toast('تعذر تعديل درجة الطالب!', gradients.error);
    }
  }
  $scope.logSearchedAttendance = (e) => {
    if (e.keyCode == 13) {
      $scope.logs[0].log.attendant = !$scope.logs[0].log.attendant;
      $scope.attendanceChanged($scope.logs[0]);
    }
  }
  $scope.attendanceChanged = (n) => {
    try {
      sdk.LogExam(n.studentid, $scope.selected_exam.id, n.log.attendant, null, (stat, result) => {
        if (stat == sdk.stats.OK) {
          toast('تم حفظ الحضور');
        } else {
          toast('تعذر تعديل حضور الطالب!', gradients.error);
        }
      });
    } catch (e) {
      toast('تعذر تعديل حضور الطالب!', gradients.error);
    }
  }
  $scope.prepareExamDel = () => {
    if ($scope.selected_exam) $('#deleteExam_modal')[0].M_Modal.open();
    else toast('لم تختار أى إمتحان!', gradients.error);
  }
  $scope.delete_exam = () => {
    sdk.RemoveExam($scope.selected_exam.id, (stat) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed();
        toast('تم حذف الإمتحان بنجاح!');
      } else toast('تعذر حذف الإمتحان!');
    });
    $scope.loadedExam = null;
  };
  $scope.grade_changed = (callback) => {
    if ($scope.selected_grade) {
      sdk.ListExams(parseInt($scope.selected_grade), (stat, exams) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.exams = exams;
            if (callback) callback();
            /*$scope.examsIds = [];
            $scope.examsNames = {};
            for (var i = 0; i < groups.length; i++) {
                $scope.examsIds.push(exams[i].id);
                $scope.examsNames[exams[i].id] = exams[i].name;
            }*/
            break;
          default:
        }
      }, true);
    }
  };
});