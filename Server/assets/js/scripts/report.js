var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location, sdk) {
  $rootScope.title = "Coretrix";
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
  var token;
  var splits = window.location.href.split('/');
  $scope.sd = simpleDate;
  let d = new Date();
  $scope.calcDates = () => {
    switch ($scope.selected_timeSelector) {
      case 'all':
        $('#start_date').datepicker('setDate', null);
        $('#end_date').datepicker('setDate', null);
        break;
      case 'lastweek':
        $('#start_date').datepicker('setDate', new Date(d.getTime() - (1000 * 60 * 60 * 24 * 7)));
        $('#end_date').datepicker('setDate', d);
        break;
      case 'lastmonth':
        $('#start_date').datepicker('setDate', new Date(d.getTime() - (1000 * 60 * 60 * 24 * 30)));
        $('#end_date').datepicker('setDate', d);
        break;
      default:
        break;
    }
  }

  $scope.printPage = () => {
    if ($scope.loaded) window.print();
    else toast('لم يتم تحميل اى بيانات!', gradients.error);
  }

  $scope.subjectsToString = (subjects) => {
    var str = "";
    for (let i = 0; i < subjects.length; i++) {
      const element = sdk.subjects_names[subjects[i]];
      if (!str) str = element;
      else str += ' و ' + element;
    }
    return str;
  }

  sdk.GetGradings((stat, result) => {
    if (stat == sdk.stats.OK) {
      $scope.gradings = result.gradings;
    }
  });

  $scope.gradeMark = (mark, max) => {
    return gradeMark(mark, max, $scope.gradings);
  }

  $scope.refetchLogs = () => {
    var datePeriod;
    let sdate = $('#start_date').val();
    let edate = $('#end_date').val();
    if (new Date(sdate) != 'Invalid Date' && new Date(edate) != 'Invalid Date') datePeriod = {
      start: sdate,
      end: edate
    };
    if ($scope.viewer == 'teacher') {
      sdk.FetchLogs(parsed, $scope.selected_link.grade, datePeriod, (stat, result) => {
        if (stat == sdk.stats.OK) {
          $scope.loaded = true;

          $scope.exams = result.exams;
          $scope.unattendedExamsCount = 0;
          let examsMarksTotal = 0;
          let examsMaxTotal = 0;
          for (const examLog of $scope.exams) {
            if (examLog.log && examLog.log.attendant) {
              examsMarksTotal += examLog.log.mark;
              examsMaxTotal += examLog.max_mark;
            }
            if (!examLog.log || !examLog.log.attendant) {
              $scope.unattendedExamsCount++;
            }
          }
          $scope.examsMarksTotal = examsMarksTotal;
          $scope.examsMaxTotal = examsMaxTotal;
          $scope.examsAverage = Math.round((examsMarksTotal / examsMaxTotal) * 100);

          $scope.classes = result.classes;
          $scope.unattendedClassesCount = 0;
          $scope.classes.forEach(classLog => {
            if (!classLog.log || !classLog.log.attendant) {
              $scope.unattendedClassesCount++;
            }
          });
          for (let i = 0; i < result.items.length; i++) {
            const item = result.items[i];
            const payment = item.log || {};
            if (!payment.payed) {
              result.items[i].payClass = 'red-text darken-1';
              result.items[i].payText = 'لم يدفعها';
            } else {
              var payedMoney = payment.payed + (payment.discount || 0);
              if (payedMoney > item.price) {
                result.items[i].payClass = 'green-text';
                result.items[i].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - item.price) + ' جنيه';
              } else if (payedMoney < item.price) {
                result.items[i].payClass = 'purple-text';
                result.items[i].payText = 'لم يدفع بالكامل متبقى ' + (item.price - payedMoney) + ' جنيه';
              } else if (payedMoney == item.price) {
                result.items[i].payClass = 'blue-text';
                result.items[i].payText = 'دفعها';
              }
            }
          }
          $scope.items = result.items;
        } else $scope.loaded = false;
      });
    } else {
      if (!$scope.selected_link) return toast('برجاء اختيار المدرس!', gradients.error);
      sdk.FetchLogsForParent(token, $scope.selected_link.teacherid, $scope.selected_link.grade, datePeriod, (stat, result) => {
        if (stat == sdk.stats.OK) {
          $scope.seleced_grade = $scope.selected_link.grade;
          $scope.group_name = $scope.selected_link.group_data[0] ? $scope.selected_link.group_data[0].name : 'لا ينتمى الطالب الى مجموعه';
          $scope.exams = result.exams;
          $scope.classes = result.classes;
          for (let i = 0; i < result.items.length; i++) {
            const item = result.items[i];
            const payment = item.log;
            if (!payment.payed) {
              result.items[i].payClass = 'red-text darken-1';
              result.items[i].payText = 'لم يدفعها';
            } else {
              var payedMoney = payment.payed + (payment.discount || 0);
              if (payedMoney > item.price) {
                result.items[i].payClass = 'green-text';
                result.items[i].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - item.price) + ' جنيه';
              } else if (payedMoney < item.price) {
                result.items[i].payClass = 'purple-text';
                result.items[i].payText = 'لم يدفع بالكامل متبقى ' + (item.price - payedMoney) + ' جنيه';
              } else if (payedMoney == item.price) {
                result.items[i].payClass = 'blue-text';
                result.items[i].payText = 'دفعها';
              }
            }
          }
          $scope.items = result.items;
          $scope.loaded = true;
        } else $scope.loaded = false;
      });
    }
  }

  $scope.reload = () => {
    sdk.GetStudent(parsed, async (stat, data) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.name = data.fullname;
          $scope.notes = data.notes;
          $scope.date_created = simpleDate(dateFromObjectId(data._id));
          await new Promise(resolve => {
            sdk.GetLinks(parsed, (stat, result) => {
              if (stat == sdk.stats.OK) {
                if (!$scope.links) {
                  $scope.links = result;
                }
                if (!$scope.selected_link) {
                  $scope.selected_link = result[0];
                }
                resolve();
              }
            });
          })
          sdk.GetGroup(data.group, (stat, result) => {
            if (stat == sdk.stats.OK) {
              $scope.refetchLogs();
              if (result) $scope.group_name = result.name;
              else $scope.group_name = 'لا ينتمى الطالب الى مجموعه';
            }
          });
          break;
        case sdk.stats.UserNonExisting:
        default:
          toast('ﻻ يوجد طالب بهذا الكود!', gradients.error);
      }
    }, true);
  }

  var id = splits[splits.length - 1];
  if (splits[splits.length - 2] == 'parent') {
    $scope.viewer = 'parent';
    token = id;
    sdk.GetInfoForParent(token, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.name = result.fullname;
          $scope.links = result.links;
          $scope.reload();
          console.log(result);
          break;
          //TODO invalid data means token is not 64 chars long
        case sdk.stats.InvalidData:
        case sdk.stats.InvalidToken:
          $rootScope.navigate('parent');
          break;
        default:
          break;
      }
    })
  } else {
    $scope.viewer = 'teacher';
    var parsed = parseInt(id);
    if (isNaN(parsed)) {
      toast('انت بتلعب ؟', gradients.error);
    } else {
      $scope.reload();
    }
  }
});