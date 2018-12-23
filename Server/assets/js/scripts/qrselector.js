var app = angular.module("coretrix", ['coretrix.sdk'])

app.run(function ($rootScope, $window, $location, sdk) {
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
  $rootScope.title = "Coretrix";
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
  sdk.CheckToken(students, () => {}, def);
}

app.controller("mainCtrl", function ($rootScope, $scope, sdk) {
  $scope.selected_code_type = 'Barcode';
  $scope.printingCount = 1;
  sdk.GetGrades((stat, result) => {
    switch (stat) {
      case sdk.stats.OK:
        $scope.grades = result;
        $scope.selected_grade = result[0];
        $scope.grade_changed();
        break;
      default:
    }
  });

  $scope.print_qr = () => {
    var users = [];
    for (var i = 0; i < $scope.students.length; i++) {
      if ($scope.students[i].selected) {
        var qr = new QRious({
          size: 188,
          value: JSON.stringify({
            id: $scope.students[i].studentid,
            code: $scope.students[i].user[0].code
          })
        });
        var obj = {
          id: idToCode($scope.students[i].studentid),
          name: $scope.students[i].fullname,
          code: $scope.students[i].user[0].code,
          link: qr.toDataURL('image/jpeg')
        };
        for (let i = 0; i < $scope.printingCount; i++) {
          users.push(obj);
        }
      }
    }

    function PrintImage(body) {
      Pagelink = "about:blank";
      var pwa = window.open(Pagelink, "_new");
      pwa.document.open();
      pwa.document.write(body);
    }

    switch ($scope.selected_code_type) {
      case 'QR':
        PrintImage(sdk.GeneratePrintingPageHtml(users));
        break;
      case 'A4 Barcode':
        PrintImage(sdk.GenerateBarcodeA4PrintHTML(users), true);
        break;
      case 'Barcode':
        PrintImage(sdk.GenerateBarcodeA4PrintHTML(users), false);
        break;
    }
  };

  $scope.toggleSelectAll = () => {
    if ($scope.selectall) {
      for (var i = 0; i < $scope.students.length; i++) {
        $scope.students[i].selected = true;
      }
    } else {
      for (var i = 0; i < $scope.students.length; i++) {
        $scope.students[i].selected = false;
      }
    }
  }

  $scope.group_changed = () => {
    sdk.QRListStudents($scope.selected_grade, $scope.selected_group.id, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.students = result.sort((a, b) => {
            if (a.fullname > b.fullname) return 1;
            if (a.fullname < b.fullname) return -1;
            return 0;
          });
          break;
        default:

      }
    });
  };

  $scope.grade_changed = (callback) => {
    if (!isNaN($scope.selected_grade)) {
      sdk.ListGroups(parseInt($scope.selected_grade), (stat, groups) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.groups = groups;
            sdk.QRListStudents($scope.selected_grade, null, (stat, result) => {
              switch (stat) {
                case sdk.stats.OK:
                  $scope.students = result.sort((a, b) => {
                    if (a.fullname > b.fullname) return 1;
                    if (a.fullname < b.fullname) return -1;
                    return 0;
                  });
                  break;
                default:

              }
            });
            break;
          default:
        }
      });
    }
  };
});