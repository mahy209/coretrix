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
  $scope.itemCategoryNames = sdk.itemCategoryNames;
  $scope.itemCategories = sdk.itemCategories;
  $scope.selectedFilter = 'all';
  $scope.blurTable = Cookies.get('blurPaymentLogsTable') ? (Cookies.get('blurPaymentLogsTable') == 'true') : true;
  var splits = window.location.href.split('/');
  var id = splits[splits.length - 1];
  var parsed = parseInt(id);
  if (typeof parsed != 'undefined' && !isNaN(parsed)) {
    sdk.GetItem(parsed, (stat, data) => {
      switch (stat) {
        case sdk.stats.OK:
          loadStuff(data.grade);
          break;
        default:

      }
    });
  } else loadStuff();

  function loadStuff(grade) {
    sdk.GetGrades((stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.grades = result;
          if (result.indexOf(grade) > -1) {
            $scope.selected_grade = grade;
            $scope.grade_changed((items) => {
              var found = false;
              for (var i = 0; i < items.length; i++) {
                if (items[i].id == parsed) {
                  $scope.selected_category = items[i].category;
                  $scope.selected_item = items[i];
                  $scope.reload();
                  found = true;
                }
              }
              if (!found) toast('لا توجد سجلات بهذه الوحدة!', gradients.error);
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

  $scope.addItem = () => {
    if (!$scope.new_item_name) toast('برجاء إدخال الاسم', gradients.error);
    if (isNaN($scope.add_selected_grade)) toast('برجاء اختيار السنه', gradients.error);
    if (!$scope.new_item_price) toast('برجاء ادخال السعر', gradients.error);
    if (!$scope.selected_category) toast('برجاء اختيار النوع', gradients.error);
    sdk.AddItem($scope.new_item_name, $scope.add_selected_grade, $scope.new_item_price, $scope.selected_category, (stat) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed();
        toast('تمت الإضافة بنجاح');
      } else toast('تعذر الإضافة', gradients.error);
    });
    $('#addItem_modal')[0].M_Modal.close();
  }
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
  $scope.setBlurCookie = () => {
    setCookie('blurPaymentLogsTable', $scope.blurTable);
  }
  $scope.search = () => {
    if ($scope.searchText) {
      var result = $scope.fuse.search($scope.searchText);
      $scope.logs = result;
    } else {
      $scope.logs = $scope.loadedLogs;
    }
  }
  $scope.barcodePayCheck = false;
  barcodeScanner((code) => {
    $scope.$apply(() => {
      $scope.searchText = code;
      $scope.search(code);
      if ($scope.barcodePayCheck) {
        setTimeout(() => {
          $scope.logSearchedPayment(null, true);
        }, 100);
      }
    });
  });
  $scope.logSearchedPayment = (e, auto) => {
    if (auto || e.keyCode == 13) {
      $scope.logs[0].log.payed = $scope.selected_item.price - $scope.logs[0].log.discount;
      $scope.payedAmountChanged($scope.logs[0]);
    }
  }
  $scope.payedAmountChanged = (n) => {
    var logIndex = $scope.logs.indexOf(n);
    try {
      if (!n.log.payed) n.log.payed = 0;
      sdk.SetPaymentLog($scope.selected_item.id, n.studentid, n.log.payed, n.log.discount, (stat, newlog) => {
        switch (stat) {
          case sdk.stats.OK:
            let set = true;
            if (!newlog) {
              newlog = {};
              set = false;
              $scope.logs[logIndex].log = {
                payed: 0,
                discount: 0,
                date: 'لم يدفع'
              };
            } else {
              newlog.date = simpleDate(newlog.date);
              if (!newlog.discount) newlog.discount = $scope.logs[logIndex].log.discount;
            }
            if (!newlog.payed || !newlog) {
              $scope.logs[logIndex].payClass = 'red-text darken-1';
              $scope.logs[logIndex].payText = 'لم يدفعها';
            } else {
              var payedMoney = newlog.payed + (newlog.discount || 0);
              if (payedMoney > $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'green-text';
                $scope.logs[logIndex].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - $scope.selected_item.price) + ' جنيه';
              } else if (payedMoney < $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'purple-text';
                $scope.logs[logIndex].payText = 'لم يدفع بالكامل متبقى ' + ($scope.selected_item.price - payedMoney) + ' جنيه';
              } else if (payedMoney == $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'blue-text';
                $scope.logs[logIndex].payText = 'دفعها';
              }
            }
            if (set) $scope.logs[logIndex].log = newlog;
            toast($scope.logs[logIndex].payText);
            break;
          default:
            toast('تعذر تعديل المبلغ المدفوع!', gradients.error);
        }
      });
    } catch (e) {
      toast('تعذر تعديل المبلغ المدفوع!', gradients.error);
    }
  }
  $scope.discountChanged = (n) => {
    var logIndex = $scope.logs.indexOf(n);
    try {
      sdk.SetPaymentLog($scope.selected_item.id, n.studentid, n.log.payed, n.log.discount, (stat, newlog) => {
        switch (stat) {
          case sdk.stats.OK:
            if (!$scope.logs[logIndex].log.payed) {
              $scope.logs[logIndex].payClass = 'red-text darken-1';
              $scope.logs[logIndex].payText = 'لم يدفعها';
            } else {
              var payedMoney = $scope.logs[logIndex].log.payed + ($scope.logs[logIndex].log.discount || 0);
              if (payedMoney > $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'green-text';
                $scope.logs[logIndex].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - $scope.selected_item.price) + ' جنيه';
              } else if (payedMoney < $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'purple-text';
                $scope.logs[logIndex].payText = 'لم يدفع بالكامل متبقى ' + ($scope.selected_item.price - payedMoney) + ' جنيه';
              } else if (payedMoney == $scope.selected_item.price) {
                $scope.logs[logIndex].payClass = 'blue-text';
                $scope.logs[logIndex].payText = 'دفعها';
              }
            }
            break;
          default:
            toast('تعذر تعديل التخفيض!', gradients.error);
        }
      });
    } catch (e) {
      toast('تعذر تعديل التخفيض!', gradients.error);
    }
  }
  $scope.reload = () => {
    if (isNaN($scope.selected_grade)) return toast('لم يتم إختيار السنة!', gradients.error);
    if (!$scope.selected_item) return; //toast('لم يتم إختيار اى حصص!', gradients.error);
    sdk.FetchPaymentLogs($scope.selected_item.id, $scope.selected_grade, (stat, logs) => {
      if (stat == sdk.stats.OK) {
        for (var i = 0; i < logs.length; i++) {
          logs[i].codeName = idToCode(logs[i].studentid);
          if (logs[i].log) {
            //TODO don't use typeof because if it was 0 then.. wtf ?
            if (!logs[i].log.discount) logs[i].log.discount = 0;
            if (!logs[i].log.date) logs[i].log.date = 'لم يدفع';
            else logs[i].log.date = simpleDate(logs[i].log.date);
            if (typeof logs[i].log.payed != 'number') logs[i].log.payed = 0;
          } else logs[i].log = {
            discount: 0,
            payed: 0,
            date: 'لم يدفع'
          }
          // Set discount
          const monthlyDiscount = logs[i].user_data.discount;
          const logDiscount = logs[i].log.discount;
          if (monthlyDiscount && !logDiscount && $scope.selected_item.category == 'subscription') {
            logs[i].log.discount = monthlyDiscount;
          }
          var payment = logs[i].log;
          if (!payment.payed) {
            logs[i].payClass = 'red-text darken-1';
            logs[i].payText = 'لم يدفعها';
          } else {
            var payedMoney = payment.payed + (payment.discount || 0);
            if (payedMoney > $scope.selected_item.price) {
              logs[i].payClass = 'green-text';
              logs[i].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - $scope.selected_item.price) + ' جنيه';
            } else if (payedMoney < $scope.selected_item.price) {
              logs[i].payClass = 'purple-text';
              logs[i].payText = 'لم يدفع بالكامل متبقى ' + ($scope.selected_item.price - payedMoney) + ' جنيه';
            } else if (payedMoney == $scope.selected_item.price) {
              logs[i].payClass = 'blue-text';
              logs[i].payText = 'دفعها';
            }
          }
        }
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
        $scope.loadedLogs = logs;
        $scope.logs = logs;
      }
    });
  };
  $scope.prepareItemDel = () => {
    if ($scope.selected_item) $('#deleteItem_modal')[0].M_Modal.open()
    else toast('لم تختار أى وحدات!', gradients.error);
  }
  $scope.delete_item = () => {
    sdk.DeleteItem($scope.selected_item.id, (stat, result) => {
      console.log(stat);
      console.log(result);
      if (stat == sdk.stats.OK) {
        $scope.grade_changed();
        $scope.loadedLogs = null;
        $scope.fuse = new Fuse([], {});
        $scope.logs = null;
        toast('تم حذف الوحدة!');
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
      sdk.ListItems(parseInt($scope.selected_grade), (stat, result) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.categories = [];
            $scope.items = {};
            result.forEach(item => {
              if ($scope.categories.indexOf(item.category) < 0) $scope.categories.push(item.category);
              if (!$scope.items[item.category]) $scope.items[item.category] = [item];
              else $scope.items[item.category].push(item);
            });
            if (callback) callback(result);
            break;
          default:
        }
      });
    }
  };
});