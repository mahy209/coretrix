var app = angular.module("coretrix", ['coretrix.sdk'])

app.filter('fuse', () => {
  const fuseOptions = {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "fullname",
    ]
  };
  return (array, searchQuery) => {
    if (!array) {
      return;
    }
    if (!searchQuery) {
      return array;
    }
    const fuse = new Fuse(array, fuseOptions);
    return fuse.search(searchQuery);
  }
})

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
  $rootScope.barcodeObservers = [];
  barcodeScanner((code) => $rootScope.barcodeObservers.forEach(observer => observer(code)));
  $rootScope.quizNames = quizNames;
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
    window.print();
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

  $scope.selectAll = false;

  $scope.ensureSelectAll = () => {
    $scope.students.map(student => student.selected = $scope.selectAll);
  };

  sdk.GetNameAndSubject((stat, result) => {
    $scope.profile = result
  })

  sdk.GetGradings((stat, result) => {
    if (stat == sdk.stats.OK) {
      $scope.gradings = result.gradings;
    }
  });

  $scope.gradeMark = (mark, max) => {
    return gradeMark(mark, max, $scope.gradings);
  }

  $rootScope.barcodeObservers.push((id) => {
    $scope.$apply(() => {
      const student = $scope.students.find(student => student.studentid == parseInt(id));
      $scope.searchQuery = student.fullname;
    })
  });

  $scope.selected_items = {};

  sdk.GetGrades((stat, grades) => {
    $scope.grades = grades;
  });

  $scope.grade_changed = () => {
    sdk.ListStudents(0, 999999999, (stat, result) => {
      if (stat == sdk.stats.OK) {
        $scope.students = result;
      }
    }, $scope.selected_grade, undefined);
    sdk.ListItems($scope.selected_grade, (stat, result) => {
      $scope.items = result;
    });
    sdk.ListGroups($scope.selected_grade, (stat, result) => {
      $scope.groups = result;
    });
  };

  $scope.showOptions = {};

  $scope.saveShowOptions = () => {
    localStorage.setItem('showOptions', JSON.stringify($scope.showOptions));
  }

  function loadShowOptions() {
    const showOptions = JSON.parse(localStorage.getItem('showOptions'));
    if (showOptions) {
      $scope.showOptions = showOptions;
    } else {
      $scope.showOptions = {
        showGrade: true,
        showGroup: true,
        showAddDate: true,
        showExamMark: true,
        showExamGrading: true,
        showExamQuiz: true,
      };
      $scope.saveShowOptions();
    }
  }

  loadShowOptions();

  $scope.refetchLogs = (id, cb) => {
    var datePeriod;
    let sdate = $('#start_date').val();
    let edate = $('#end_date').val();
    if (new Date(sdate) != 'Invalid Date' && new Date(edate) != 'Invalid Date') datePeriod = {
      start: sdate,
      end: edate
    };

    sdk.FetchLogs(id, $scope.selected_grade, datePeriod, (stat, result) => {
      const report = {};
      if (stat == sdk.stats.OK) {
        report.exams = result.exams;
        report.unattendedExamsCount = 0;
        let examsMarksTotal = 0;
        let examsMaxTotal = 0;
        for (const examLog of report.exams) {
          if (examLog.log && examLog.log.attendant) {
            examsMarksTotal += examLog.log.mark;
            examsMaxTotal += examLog.max_mark;
          }
          if (!examLog.log || !examLog.log.attendant) {
            report.unattendedExamsCount++;
          }
        }
        report.examsMarksTotal = examsMarksTotal;
        report.examsMaxTotal = examsMaxTotal;
        report.examsAverage = Math.round((examsMarksTotal / examsMaxTotal) * 100);

        report.classes = result.classes;
        report.unattendedClassesCount = 0;
        report.classes.forEach(classLog => {
          if (!classLog.log || !classLog.log.attendant) {
            report.unattendedClassesCount++;
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
        report.items = result.items;
        cb(report);
      }
    });
  }

  $scope.loadStudent = (id) => {
    console.log(id);
    sdk.GetStudent(id, async (stat, data) => {
      console.log({
        stat,
        data
      });
      switch (stat) {
        case sdk.stats.OK:
          const report = {
            student: {
              ...data,
              date_created: simpleDate(dateFromObjectId(data._id)),
            },
          };
          $scope.refetchLogs(id, (logsReport) => {
            const full = {
              ...report,
              ...logsReport,
            };
            $scope.reports.push(full);
          });
          break;
        case sdk.stats.UserNonExisting:
        default:
          toast('ﻻ يوجد طالب بهذا الكود!', gradients.error);
      }
    }, true);
  };

  $scope.reports = [];

  $scope.reload = () => {
    const students = $scope.students.filter(student => student.selected);
    $scope.reports = [];
    students.map(student => $scope.loadStudent(student.studentid));
  }

});