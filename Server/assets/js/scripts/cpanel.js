// var app = angular.module("coretrix", ['coretrix.sdk', 'coretrix.languages', 'ngRoute'])
var app = angular.module('coretrix', ['coretrix.sdk', 'dndLists', 'sf.virtualScroll'])

app.run(function ($rootScope, $window, $location, sdk) {
  angular.element(document).ready(function () {
    $('.modal').modal()
    $('select').material_select()
  })
  // changeLogger('log')
  /*var lang = getLang()
  var language = languages[lang]
  $rootScope.language = language;*/
  $rootScope.openLink = (link) => {
    window.open(link, '_blank')
  }
  $rootScope.weekdays = [
    'السبت',
    'الاحد',
    'الاثنين',
    'الثلاثاء',
    'الاربعاء',
    'الخميس',
    'الجمعه'
  ]
  $rootScope.NumericOrderStrings = [
    'الأولى',
    'الثانية',
    'الثالثة',
    'الرابعة',
    'الخامسة',
    'السادسة',
    'السابعة'
  ]
  $rootScope.all_grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  $rootScope.allowedGradesChanged = (n) => {
    var gs = Cookies.get('grades')
    if (!gs) {
      $rootScope.allowedGrades = [11, 12, 13]
    } else {
      try {
        gs = JSON.parse(gs)
        var returner = []
        for (var i = 0; i < Object.keys(gs).length; i++) {
          if (gs['g' + i]) {
            returner.push(i)
          }
        }
        $rootScope.allowedGrades = returner
      } catch (e) {
        $rootScope.allowedGrades = [11, 12, 13]
      }
    }
  }
  $rootScope.allowedGradesChanged('msg')
  $rootScope.variableListeners = []
  $rootScope.grades_names = sdk.grades_names
  $rootScope.title = 'Coretrix'
  $rootScope.navigate = (link) => {
    if (!link) link = ''
    $window.location.href = '/' + link
  }
  $rootScope.path = (link) => {
    if (!link) link = ''
    $location.path('/' + link)
  }
  $rootScope.animate = (id, animation) => {
    var cs = 'animated ' + animation
    id = '#' + id
    $(id).addClass(cs)
    setTimeout(() => {
      $(id).removeClass(cs)
    }, 1000)
  }
  $rootScope.convertTime = (input) => {
    var hours = Math.floor(input / 60)
    var minutes = input - (hours * 60)
    return hours > 12 ? `${(hours - 12)}${minutes ? ':' + minutes : ''} PM` : hours + ' AM'
  }
  var last_cam_state
  $rootScope.reloadVariables = (type) => {
    sdk.GetGrades((stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          for (var i = 0; i < $rootScope.variableListeners.length; i++) {
            $rootScope.variableListeners[i](true, result, type)
          }
          break
        default:
      }
    })
  }
  $rootScope.changeTab = (newtab) => {
    if ($rootScope.tab == 'home') last_cam_state = $rootScope.camera_enabled
    // to avoid errors when mainCtrl is not loaded yet
    if ($rootScope.setCamera) {
      if (newtab == 'home') $rootScope.setCamera(last_cam_state)
      else $rootScope.setCamera(false)
    }
    $window.scrollTo(0, 0)
    $rootScope.tab = newtab
  }
  $rootScope.changeTab('home')
  $('#view').show()
  $rootScope.showshit = false
  $rootScope.logout = function () {
    Cookies.remove('token')
    $rootScope.navigate()
  }
  /*$('.modal').modal()
  $('select').material_select();*/
  confirm($rootScope, sdk)
})

app.controller('examsCtrl', function ($rootScope, $scope, sdk) {
  $scope.grades_names = sdk.grades_names
  $scope.newExam_redline = 25
  $scope.newExam_max = 30
  $scope.openExamLogs = (e) => {
    if (e) window.open('/exam_logs/' + e.id, '_blank')
    else window.open('/exam_logs', '_blank')
  }
  let first = true
  var init = (refreshing, result, type) => {
    var c = null
    if ($scope.selected_grade) c = $scope.selected_grade
    $scope.grades = result
    if (c) $scope.selected_grade = c
    else $scope.selected_grade = result[0]
    if (type == 'exams' || first) $scope.grade_changed()
    if (first) first = false
  }
  $rootScope.variableListeners.push(init)
  $scope.grade_changed = () => {
    if ($scope.selected_grade) {
      sdk.ListExams(parseInt($scope.selected_grade), (stat, exams) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.exams = exams
            break
          default:
        }
      })
    }
  }
  $scope.prepareDel = (exam) => {
    $('#deleteExam_modal')[0].M_Modal.open()
    $scope.removeExam = () => {
      sdk.RemoveExam(exam.id, (stat) => {
        if (stat == sdk.stats.OK) {
          $rootScope.reloadVariables('exams')
          toast('تم حذف الإمتحان بنجاح!')
        } else toast('تعذر حذف الإمتحان!')
      })
    }
  }
  $scope.addExam = () => {
    if ($scope.newExam_name == null) return toast('من فضلك قم بإدخال اسم الإمتحان', gradients.error)
    if ($scope.addExam_selectedGrade == null) return toast('من فضلك قم بإختيار السنة', gradients.error)
    sdk.AddExam($scope.newExam_name, parseInt($scope.addExam_selectedGrade), $scope.newExam_max, $scope.newExam_redline, (stat) => {
      switch (stat) {
        case sdk.stats.OK:
          $rootScope.reloadVariables('exams')
          toast('تم إضافة الإمتحان بنجاح!')
          break
        default:
          toast('تعذر إضافة الإمتحان!', gradients.error)
      }
      $('#addExam_modal')[0].M_Modal.close()
    })
  }
  $scope.editExam = () => {
    if (!$scope.editExam_name) return toast('برجاء كتابة اسم الإمتحان!', gradients.error)
    if (!$scope.editExam_max) return toast('برجاء إدخال أعلى درجة للإمتحان!', gradients.error)
    if (!$scope.editExam_redline) return toast('برجاء إدخال الخط الأحمر للدرجات!', gradients.error)
    sdk.EditExam($scope.loadedExamId, $scope.editExam_name, $scope.editExam_max, $scope.editExam_redline, (stat) => {
      if (stat == sdk.stats.OK) {
        $rootScope.reloadVariables('exams')
        toast('تم تعديل الإمتحان بنجاح!')
      } else toast('تعذر تعديل الإمتحان!', gradients.error)
      $('#editExam_modal')[0].M_Modal.close()
    })
    $scope.loadedExamId = null
  }
  $scope.loadExam = (exam) => {
    sdk.GetExam(exam.id, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.editExam_name = result.name
          $scope.editExam_max = result.max_mark
          $scope.editExam_redline = result.redline
          $scope.loadedExamId = exam.id
          $('#editExam_modal')[0].M_Modal.open()
          break
        default:
          toast('تعذر تحميل بيانات الإمتحان!', gradients.error)
      }
    })
  }
})

app.controller('paylogsCtrl', function ($scope, sdk) {
  $scope.abs = (num) => {
    return Math.abs(num);
  }

  $scope.paylogs = [];

  $scope.initMessage = (item) => {
    console.log({
      item
    });
  }
  $scope.refreshLogs = () => {
    const calculate = (paylogs) => {
      let totalAmount = 0;
      let totalIncome = 0;
      let totalOutcome = 0;
      for (let i = 0; i < paylogs.length; i++) {
        const payed = paylogs[i].payed;
        if (payed > 0) {
          totalIncome += payed;
        }
        if (payed < 0) {
          totalOutcome += Math.abs(payed);
        }
        totalAmount += payed;
      }
      return {
        totalAmount,
        totalIncome,
        totalOutcome,
      };
    }
    const date = new Date($('#paylogs_date').val());
    const comparingDate = new Date($('#comparing_paylogs_date').val());
    const compare = date.getDate() != comparingDate.getDate();
    if (compare) {
      sdk.ListPayments(date, comparingDate, (stat, paylogs) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.currentDay = `${simpleDate(comparingDate)} => ${simpleDate(date)}`;
            const totals = calculate(paylogs);
            $scope.totalIncome = totals.totalIncome;
            $scope.totalOutcome = totals.totalOutcome;
            $scope.totalAmount = totals.totalAmount;
            $scope.paylogs = paylogs;
            moveLogsScrollForVirtualRepeat();
            break;
          default:
            break;
        }
      });
    } else {
      sdk.ListPayments(date, date, (stat, paylogs) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.currentDay = simpleDate(date);
            const totals = calculate(paylogs);
            $scope.totalIncome = totals.totalIncome;
            $scope.totalOutcome = totals.totalOutcome;
            $scope.totalAmount = totals.totalAmount;
            $scope.paylogs = paylogs;
            moveLogsScrollForVirtualRepeat();
            break;
          default:
            break;
        }
      });
    }
  };

  $scope.print = () => {
    window.print();
  }
  const today = date.format(new Date(), 'MM/DD/YYYY');
  $('#paylogs_date').val(today);
  $('#comparing_paylogs_date').val(today);
  $scope.refreshLogs();

  let addPayLog = (payed) => {

    if (!$scope.paylog_name) return toast('برجاء ادخال تعليق');
    if (!$scope.paylog_amount) return toast('برجاء ادخال المبلغ');

    let picked_date = new Date($('#paylogs_date').val());
    let current_date = new Date();

    if (stripDate(current_date).getTime() == picked_date.getTime()) {
      picked_date = current_date;
    } else {
      picked_date = stripDate(picked_date, true);
    }

    sdk.AddPayLog(
      $scope.paylog_name,
      payed,
      picked_date, (stat) => {
        if (stat == sdk.stats.OK) {
          $scope.refreshLogs();
        }
      });

  };

  let delete_id = null;

  $scope.openRemoveModal = (_id) => {
    delete_id = _id;
    $('#paylog_delete_modal')[0].M_Modal.open();
  }

  $scope.removePayLog = () => {
    sdk.SetPayLog(delete_id, 0, (stat) => {
      if (stat == sdk.stats.OK) {
        toast('تم الحذف بنجاح');
        $scope.refreshLogs();
      } else {
        toast('تعذر حذف العنصر');
      }
    });
    $('#paylog_delete_modal')[0].M_Modal.close();
  }

  $scope.addExpense = () => {
    addPayLog(0 - $scope.paylog_amount);
  };

  $scope.addIncome = () => {
    addPayLog($scope.paylog_amount);
  };
});

app.controller('smsCtrl', function ($rootScope, $scope, $location, sdk) {
  $scope.sendingSMS = false
  $scope.select_all = true
  $scope.selected_protocol = 'legacy';

  let params = parseQS($location.hash())
  if (params.tab == 'sms') $rootScope.tab = 'sms'

  var init = (refreshing, result) => {
    $scope.grades = result
    if (params.grade) {
      $scope.selected_grade = parseInt(params.grade)
      $scope.grade_changed()
    }
    if (params.type) $scope.selected_type = params.type
  }

  $rootScope.variableListeners.push(init);

  $scope.checkMessageLength = (event) => {
    if ($scope.message.length > 70) {
      event.preventDefault();
    }
  };

  $scope.allStudentsChange = () => {
    $scope.selected_type = "message";
    $scope.selected_grade = null;
    $scope.grade_changed();
  }

  $scope.grade_changed = () => {
    if ($scope.selected_grade) $scope.loadClasses();
    sdk.ListStudents(0, 0, (stat, students) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.students = students
          break
        default:
          break
      }
    }, $scope.selected_grade, undefined, true);

    if ($scope.selected_grade) sdk.ListGroups(parseInt($scope.selected_grade), (stat, groups) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.groups = groups
          break
        default:
      }
    });
  }

  $scope.loadDevices = () => {
    sdk.ADBListDevices((stat, devices) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.devices = devices
          break
      }
    })
  }

  $scope.loadDevices()

  $scope.loadClasses = () => {
    sdk.GetGradeMonths(parseInt($scope.selected_grade), (stat, months) => {
      switch (stat) {
        case sdk.stats.OK:
          months.map(grademonth => {
            grademonth.name = gradeMonth(grademonth)
            return grademonth
          })
          $scope.months = months
          if (params.month && params.year) $scope.selected_month = months.find(m => m.month == params.month && m.year == params.year)
          break
        default:
      }
    })
    sdk.ListExams(parseInt($scope.selected_grade), (stat, exams) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.exams = exams
          if (params.exam) {
            $scope.selected_exam = exams.find(e => e.id == params.exam)
            $scope.examChanged()
          }
          break
        default:
      }
    }, true)
    sdk.ListClasses(parseInt($scope.selected_grade), (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          for (var i = 0; i < result.length; i++) {
            result[i].date = simpleDate(new Date(result[i].date))
            if (result[i].links) result[i].linksString = classesLinksToDayString(result[i].links)
          }
          $scope.classes = result
          if (params.class) {
            $scope.selected_class = result.find(c => c.id == params.class)
            $scope.classChanged()
          }
          break
        default:
      }
    })
  }

  sdk.GetNameAndSubject((stat, result) => {
    $scope.profile = result
  })

  function formatClassDay(c) {
    if (c.linksString) {
      return (c.addedClass ? 'حصة إضافية ' : '') + (c.classnum != null ? 'الحصة ' + $scope.NumericOrderStrings[c.classnum] : '') + (c.linksString ? ' - ' + c.linksString : '')
    } else {
      return 'حصة يوم ' + c.date
    }
  }

  $scope.assertSelectAll = () => {
    switch ($scope.selected_type) {
      case 'lesson':
        for (let i = 0; i < $scope.class_logs.length; i++) {
          $scope.class_logs[i].selected = $scope.select_all
        }
        break
      case 'exam':
        for (let i = 0; i < $scope.exam_logs.length; i++) {
          $scope.exam_logs[i].selected = $scope.select_all
        }
      case 'message':
        for (let i = 0; i < $scope.message_students.length; i++) {
          $scope.message_students[i].selected = $scope.select_all
        }
      default:
        break
    }
  }

  $scope.classChanged = () => {
    sdk.FetchClassLogs($scope.selected_class.id, $scope.selected_grade, (stat, logs) => {
      if (stat == sdk.stats.OK) {
        $scope.class_logs = logs
      } else {
        $scope.class_logs = []
      }
      $scope.assertSelectAll()
    }, true)
  }

  $scope.examChanged = () => {
    sdk.FetchExamLogs($scope.selected_exam.id, $scope.selected_grade, (stat, logs) => {
      if (stat == sdk.stats.OK) {
        $scope.exam_logs = logs
      } else {
        $scope.exam_logs = []
      }
      $scope.assertSelectAll()
    }, true)
  }

  $scope.typeChanged = () => {
    sdk.ListStudents(0, 0, (stat, students) => {
      if (stat == sdk.stats.OK) {
        $scope.message_students = students
      } else {
        $scope.message_students = []
      }
    }, $scope.selected_grade, undefined, true)
  }

  $scope.selected_recipient = 'parent';
  $scope.send = () => {
    if (!$scope.selected_grade && !$scope.allStudents) return toast('برجاء اختيار السنه')
    if (!$scope.selected_type) return toast('برجاء اختيار نوع التقرير')
    if (!$scope.selected_device) return toast('برجاء اختيار الهاتف')
    if (!$scope.selected_recipient) return toast('برجاء اختيار مستلم الرسالة')

    $scope.smsStudent = ''
    $scope.smsProgress = 0
    $scope.smsFailed = false

    let process = (logs, format) => {
      if ($scope.selected_group) {
        logs = logs.filter(log => log.group == $scope.selected_group.id);
      }
      $scope.sendingSMS = true

      let send = (i) => {
        if (i >= logs.length) return;

        const log = logs[i]

        // Log progress
        $scope.smsStudent = log.fullname
        $scope.smsProgress = ((i + 1) / logs.length) * 100

        let num = prioritizeNumber(log.contacts, $scope.selected_recipient);

        console.log({
          log,
          num
        });

        if (!num) return send(i + 1);

        let smsMessage = format(log)

        sdk.ADBSendSMS($scope.selected_device.id, num, smsMessage, $scope.selected_protocol, (stat) => {
          switch (stat) {
            case sdk.stats.OK:
              send(i + 1)
              break
            default:
              $scope.smsFailed = true
              $scope.smsStudent = 'حدث خطأ ما أثناء ارسال الرسائل'
              break
          }
        })
      }
      send(0);
    }

    const formatClass = (log) => {
      return formatClassReport(
        $scope.profile, log, {
          attendant: $scope.smsAttendant,
          quiz: $scope.smsQuiz,
          homework: $scope.smsHomework
        },
        formatClassDay($scope.selected_class))
    }

    const formatExam = (log) => {
      return formatExamReport(
        $scope.profile, log, $scope.selected_exam.max_mark, $scope.selected_exam.name)
    }

    const formatMessage = () => {
      return $scope.message + ($scope.addSignature ? ` - ${formatSignature($scope.profile)}` : '')
    }

    switch ($scope.selected_type) {
      case 'lesson':
        var logs = $scope.class_logs.filter(log => log.selected);
        if ($scope.filterAttendance) {
          logs = logs.filter(item => !item.log || !item.log.attendant);
        }
        if (!$scope.selected_class) return toast('برجاء اختيار الحصة')
        process(logs, formatClass)
        break
      case 'exam':
        var logs = $scope.exam_logs.filter(log => log.selected);
        if ($scope.filterAttendance) {
          logs = logs.filter(item => !item.log || !item.log.attendant);
        }
        if (!$scope.selected_exam) return toast('برجاء اختيار الامتحان')
        process(logs, formatExam)
        break
      case 'message':
        if (!$scope.message) return toast('برجاء كتابة رسالة')
        process($scope.message_students.filter(log => log.selected), formatMessage)
        break
      case 'report':
        if (!$scope.selected_month) return toast('برجاء اختيار الشهر')

        let students = $scope.students

        const startDate = new Date($scope.selected_month.year, $scope.selected_month.month)
        let endDate = date.addMonths(startDate, 1)
        endDate = date.addDays(endDate, -1)

        let i = 0

        const sendLogsSMS = (student) => {

          if (students.length <= i) return

          $scope.sendingSMS = true

          sdk.FetchLogs(student.id, $scope.selected_grade, {
            start: startDate,
            end: endDate
          }, (stat, logs) => {
            switch (stat) {
              case sdk.stats.OK:
                const notifs = []

                let unattClasses = 0
                let unattExams = 0

                notifs.push(intro + ' ' + student.fullname)

                const separator = '-----------'

                notifs.push(separator)
                notifs.push('الحصص')
                notifs.push(separator)

                logs.classes.forEach(classLog => {
                  if (!classLog.log || !classLog.log.attendant) unattClasses++
                  classLog.fullname = student.fullname
                  if (classLog.links) classLog.linksString = classesLinksToDayString(classLog.links)
                  classLog.date = simpleDate(classLog.date)
                  notifs.push(formatClassReport($scope.profile, classLog, {
                    attendant: true,
                    quiz: true,
                    homework: true
                  }, formatClassDay(classLog), true))
                })

                notifs.push(separator)
                notifs.push('الامتحانات')
                notifs.push(separator)

                logs.exams.forEach(examLog => {
                  if (!examLog.log || !examLog.log.attendant) unattExams++
                  examLog.fullname = student.fullname
                  notifs.push(formatExamReport(
                    $scope.profile, examLog, examLog.max_mark, examLog.name, true))
                })

                notifs.push(separator)

                notifs.push('مجموع الحصص التى لم يحضرها: ' + unattClasses)
                notifs.push('مجموع الامتحانات التى لم يحضرها: ' + unattExams)

                notifs.push(separator)
                notifs.push(formatSignature($scope.profile))

                let smsMessage = notifs.join('\n ')

                let num = prioritizeNumber(student.contacts)

                $scope.smsStudent = student.fullname
                $scope.smsProgress = ((i + 1) / students.length) * 100

                sdk.ADBSendSMS($scope.selected_device.id, num, smsMessage, (stat) => {
                  switch (stat) {
                    case sdk.stats.OK:
                      sendLogsSMS(students[++i])
                      break
                    default:
                      $scope.smsFailed = true
                      $scope.smsStudent = 'حدث خطأ ما أثناء ارسال الرسائل'
                      break
                  }
                })
                break

              default:
                break
            }
          })
        }

        sendLogsSMS(students[0])
        break
    }
  }
})
app.controller('paymentsCtrl', function ($rootScope, $scope, sdk) {
  $scope.trash = []
  $scope.itemCategoryNames = sdk.itemCategoryNames
  $scope.itemCategories = sdk.itemCategories
  $scope.new_item_price = 60
  $scope.categoriesIcons = {
    subscription: 'fa-money',
    book: 'fa-book',
    paper: 'fa-file-text',
    revision: 'fa-retweet',
    course: 'fa-users'
  }
  $scope.grade_changed = () => {
    sdk.ListItems($scope.selected_grade, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.items = result
          break
        default:

      }
    })
  }
  var firstload = true
  var init = (refreshing, result) => {
    var c = $scope.selected_grade
    $scope.grades = result
    $scope.selected_grade = c || result[0]
    if (firstload) $scope.grade_changed()
    firstload = false
  }
  $rootScope.variableListeners.push(init)
  $scope.showbasket = () => {
    var basket = $('#basket')
    basket.css('bottom', '-22%')
    basket.show()
    basket.animate({
      bottom: '0'
    }, {
      duration: 300
    })
  }
  $scope.hidebasket = () => {
    $('#basket').animate({
      bottom: '-22%'
    }, {
      duration: 300,
      complete: () => {
        $('#basket').css('display', 'none')
      }
    })
  }
  $scope.deleteItems = () => {
    for (let i = 0; i < $scope.trash.length; i++) {
      const element = $scope.trash[i]
      sdk.DeleteItem(element.id, (stat) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.trash = []
            $scope.hidebasket()
            toast('تم حذف الوحده بنجاح!')
            break
          default:
            $scope.items.push(element)
            toast('تعذر حذف الوحدة!', gradients.error)
            break
        }
      })
    }
  }
  $scope.addItem = () => {
    if (!$scope.new_item_name) return toast('برجاء إدخال الاسم', gradients.error)
    if (!$scope.add_selected_grade) return toast('برجاء اختيار السنه', gradients.error)
    if (!$scope.new_item_price) return toast('برجاء ادخال السعر', gradients.error)
    if (!$scope.selected_category) return toast('برجاء اختيار النوع', gradients.error)
    sdk.AddItem($scope.new_item_name, $scope.add_selected_grade, $scope.new_item_price, $scope.selected_category, (stat) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed()
        toast('تم الإضافة بنجاح')
      } else toast('تعذر الإضافة', gradients.error)
    })
    $('#addItem_modal')[0].M_Modal.close()
  }
})

app.controller('groupsCtrl', function ($rootScope, $scope, sdk) {
  $scope.grades_names = sdk.grades_names
  $scope.trash = []
  $scope.groupsUniques = {}
  $scope.currentLinker = 0
  $scope.currentLink = {}
  $scope.grade_changed = () => {
    if (typeof $scope.selected_grade == 'number') {
      sdk.ListGroups(parseInt($scope.selected_grade), (stat, groups) => {
        switch (stat) {
          case sdk.stats.OK:
            sdk.ListGroupClassesLinks($scope.selected_grade, (stat, result) => {
              switch (stat) {
                case sdk.stats.OK:
                  $scope.linkers = []
                  $scope.freelinks = []
                  for (let i = 0; i < $scope.groups.length; i++) {
                    const days = $scope.groups[i].schedule.days
                    days.forEach(day => {
                      $scope.freelinks.push({
                        groupid: $scope.groups[i].id,
                        day: day
                      })
                    })
                  }
                  for (let i = 0; i < result.classescount; i++) {
                    $scope.linkers.push([])
                  }
                  for (let i = 0; i < result.links.length; i++) {
                    const element = result.links[i]
                    element.links.forEach(link => {
                      for (let index = 0; index < $scope.freelinks.length; index++) {
                        const element = $scope.freelinks[index]
                        if (element.groupid == link.groupid && element.day == link.day) $scope.freelinks.splice(index, 1)
                      }
                    })
                    $scope.linkers[element.classnum] = element.links
                  }
                  break
                default:
                  break
              }
            })
            for (let i = 0; i < groups.length; i++) {
              const element = groups[i]
              $scope.groupsUniques[element.id] = element.name
            }
            $scope.groups = groups
            break
          default:
        }
      })
    }
  }
  $scope.showbasket = () => {
    var basket = $('#basket_groupclasses')
    basket.css('bottom', '-22%')
    basket.show()
    basket.animate({
      bottom: '0'
    }, {
      duration: 300
    })
  }
  $scope.hidebasket = () => {
    $('#basket_groupclasses').animate({
      bottom: '-22%'
    }, {
      duration: 300,
      complete: () => {
        $('#basket_groupclasses').css('display', 'none')
      }
    })
  }
  $scope.deleteGroupClasses = () => {
    for (let i = 0; i < $scope.trash.length; i++) {
      const element = $scope.trash[i]
      sdk.RemoveGroupClass(element.groupid, element.day, $scope.selected_grade, (stat) => {
        switch (stat) {
          case sdk.stats.OK:
            $rootScope.reloadVariables('groupslinks')
            break
          default:
            toast('تعذر حذف الحصة من المجموعة!', gradients.error)
            break
        }
      })
    }
  }
  $scope.linkGroupClass = (link, classnum) => {
    function failed() {
      toast('تعذر ربط الحصه!', gradients.error)
    }
    try {
      sdk.LinkGroupClasses($scope.selected_grade, classnum, link.groupid, link.day, (stat, result) => {
        switch (stat) {
          case sdk.stats.OK:
            $rootScope.reloadVariables('groupslinks')
            break
          default:
            failed()
            break
        }
      })
    } catch (e) {
      failed()
    }
  }
  let first = true
  var init = (refreshing, result, type) => {
    let c = $scope.selected_grade
    $scope.grades = result
    $scope.selected_grade = c || result[0]
    if (type == 'groups' || type == 'groupslinks' || first) $scope.grade_changed()
    if (first) first = false
  }
  $rootScope.variableListeners.push(init)
  $scope.prepareDel = (group) => {
    $('#deleteGroup_modal')[0].M_Modal.open()
    $scope.removeGroup = () => {
      sdk.RemoveGroup(group.id, (stat, result) => {
        if (stat == sdk.stats.OK) {
          $rootScope.reloadVariables('groups')
          toast('تم حذف المجموعة بنجاح!')
        }
      })
    }
  }

  var selected_days_template = [{
      id: 0,
      name: 'السبت',
      selected: false
    },
    {
      id: 1,
      name: 'الاحد',
      selected: false
    },
    {
      id: 2,
      name: 'الاثنين',
      selected: false
    },
    {
      id: 3,
      name: 'الثلاثاء',
      selected: false
    },
    {
      id: 4,
      name: 'الاربعاء',
      selected: false
    },
    {
      id: 5,
      name: 'الخميس',
      selected: false
    },
    {
      id: 6,
      name: 'الجمعه',
      selected: false
    }
  ]
  $scope.selected_days = selected_days_template
  $scope.edit_selected_days = selected_days_template

  function getTimeFromPicker(time_val) {
    var timeregex = /([0-9]+):([0-9]+)([APM]+)/
    let start_time = timeregex.exec(time_val)
    let raw_time = (parseInt(start_time[1]) * 60) + parseInt(start_time[2])
    if (start_time[3] == 'AM' && raw_time == 720) return 0
    else return start_time[3] == 'AM' ? raw_time : 720 + raw_time
  }

  function getDaysFromModel(model) {
    let days = []
    for (let i = 0; i < model.length; i++) {
      const element = model[i]
      if (element.selected) days.push(element.id)
    }
    return days
  }
  $scope.group_add = () => {
    // var grouptime_value = $('#grouptime').val()
    if ($scope.new_group_name == null) return toast('من فضلك قم بإدخال اسم المجموعة', gradients.error)
    if ($scope.addGroup_selected_grade == null) return toast('من فضلك قم بإختيار السنة', gradients.error)
    // if (!grouptime_value) return toast('من فضلك قم بإدخال ميعاد المجموعة', gradients.error)
    if ($scope.new_group_name == null) return toast('من فضلك قم بإدخال اسم المجموعة', gradients.error)
    let days = getDaysFromModel($scope.selected_days)
    if (days.length <= 0) return toast('من فضلك قم باختيار ايام المجموعه', gradients.error)
    sdk.CreateGroup($scope.new_group_name, parseInt($scope.addGroup_selected_grade), {
      time: 720,
      /*time: getTimeFromPicker(grouptime_value)*/
      days: days
    }, (stat, newid) => {
      switch (stat) {
        case sdk.stats.OK:
          $rootScope.reloadVariables('groups')
          $('#addGroup_modal')[0].M_Modal.close()
          toast('تم إضافة المجموعه بنجاح!')
          break
        default:
          toast('تعذر إضافة المجموعه!', gradients.error)
      }
    })
  }
  $scope.group_edit = () => {
    if (!$scope.edit_group_name) return toast('برجاء كتابة اسم المجموعة!', gradients.error)
    // let time_val = $('#edit_grouptime').val()
    // if (!time_val) return toast('برجاء ادخال ميعاد الحصه!', gradients.error)
    let days = getDaysFromModel($scope.edit_selected_days)
    if (days.length <= 0) return toast('برجاء اختيار ايام المجموعه!', gradients.error)
    sdk.EditGroup($scope.loadedGroup, $scope.edit_group_name, {
      days: days,
      time: 720 /*time: getTimeFromPicker(time_val)*/
    }, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          toast('تم تعديل المجموعة بنجاح!')
          $rootScope.reloadVariables('groups')
          $('#editGroup_modal')[0].M_Modal.close()
          break
        default:
          toast('تعذر تعديل المجموعة!', gradients.error)

      }
    })
    $scope.loadedGroup = null
  }
  $scope.loadGroup = (g) => {
    sdk.GetGroup(g.id, (stat, group) => {
      $scope.loadedGroup = g.id
      if (stat == sdk.stats.OK) {
        $scope.edit_group_name = group.name
        for (let i = 0; i < $scope.edit_selected_days.length; i++) {
          if (group.schedule.days.indexOf($scope.edit_selected_days[i].id) > -1) $scope.edit_selected_days[i].selected = true
          else $scope.edit_selected_days[i].selected = false
        }
        /*var h = Math.floor(group.schedule.time / 60)
        var mm = Math.floor(group.schedule.time - (h * 60))
        var pm = h > 12
        $('#edit_grouptime').val(`${pm ? h - 12 : h}:${mm}${pm ? 'PM' : 'AM'}`);*/
        $('#editGroup_modal')[0].M_Modal.open()
      }
    })
  }
})

app.controller('studentsCtrl', function ($rootScope, $scope, sdk) {
  $scope.startnum = 0
  $scope.limit = parseInt(Cookies.get('limit')) || 10
  $scope.opt_grade = parseInt(Cookies.get('opt_grade'))
  $scope.opt_group = parseInt(Cookies.get('opt_group'))
  $scope.selectedPage_num = 0
  $scope.mode = 'load'; /* load | search */
  var init = (refreshing, result, type) => {
    var c = $scope.opt_grade
    $scope.grades = result
    if (typeof c != 'undefined') $scope.opt_grade = c
    else $scope.opt_grade = result[0]
    if (type == 'groups') $scope.load_optGroups()
  }
  $rootScope.variableListeners.push(init)
  initLoadMode = () => {
    sdk.CountStudents((stat, count) => {
      switch (stat) {
        case stats.OK:
          createPagination(count)
          if (count > 0) $scope.changePage(1)
          break
        default:
      }
    })
  }
  initLoadMode()
  $scope.reload = () => {
    $scope.mode = 'load'
    initLoadMode()
  }
  $scope.performSearch = (e) => {
    /* 13 for enter and 32 for space */
    if (e.keyCode == 32) {
      sdk.SearchStudents(neutralizeName($scope.searchStudents_val, true), function (stat, search_result) {
        switch (stat) {
          case sdk.stats.OK:
            var result = search_result.result
            var cmpdata = {}
            for (var key in result) {
              var item = result[key]
              cmpdata[item.fullname] = null
            }
            $('#searchStudents').autocomplete({
              data: cmpdata,
              limit: 20,
              onAutocomplete: function (val) {
                $scope.performSearch({
                  keyCode: 13
                })
                // window.open("/profile/" + result[Object.keys(cmpdata).indexOf(val)].id, "_blank")
              },
              minLength: 1
            })
            break
          default:
        }
      })
    } else if (e.keyCode == 13) {
      if ($scope.searchStudents_val == undefined) {
        $scope.reload()
      } else {
        $scope.searching_name = neutralizeName($scope.searchStudents_val, true)
        sdk.SearchStudents($scope.searching_name, function (stat, result) {
          switch (stat) {
            case sdk.stats.OK:
              $scope.mode = 'search'
              createPagination(result.count)
              $scope.changePage(1)
              break
            default:
          }
        }, 1)
      }
    }
  }
  $scope.$watch('selectedPage_num', (n) => {})
  $scope.changePage = (num) => {
    if (typeof num != 'number' || num < 1) num = 1
    if ($scope.pages.length > 0) {
      $scope.startnum = $scope.pages[num - 1].startid
      if ($scope.pages[$scope.selectedPage_num]) $scope.pages[$scope.selectedPage_num].selected = false
    } else $scope.startnum = 0
    $scope.selectedPage_num = num - 1
    if ($scope.pages.length > 0) $scope.pages[num - 1].selected = true
    if ($scope.mode == 'load') $scope.loadStudents()
    else if ($scope.mode == 'search') $scope.loadSearch()
  }

  $scope.loadSearch = () => {
    sdk.SearchStudents($scope.searching_name, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.students = result.result
          break
        default:
      }
    }, $scope.limit, $scope.startnum)
  }

  function createPagination(count, unset) {
    // $scope.startnum = 0
    $scope.pages = []
    var c = Math.ceil(count / $scope.limit)
    for (var i = 0; i < c; i++) {
      var page = {
        startid: i * $scope.limit,
        num: i + 1,
        selected: (i == 0 && !unset) ? true : false
      }
      $scope.pages.push(page)
    }
  }

  $scope.registered = []
  $scope.selected_grade = null
  $scope.selected_group = null
  $('#edit_modal').modal({
    complete: () => {
      // unload student
      $scope.loadedStudent = null
    }
  })
  $scope.checkAndSearch = (event) => {
    if (event.keyCode == 32) {
      var newname = $scope.studentName
      if (newname) sdk.SearchStudents(neutralizeName(newname, true), function (stat, search_result) {
        switch (stat) {
          case sdk.stats.OK:
            var result = search_result.result
            if (result.length > 0) {
              var data = {}
              var cmpdata = {}
              for (var i = 0; i < result.length; i++) {
                data[result[i].fullname] = result[i].id
                result[i] = result[i].fullname
                cmpdata[result[i]] = null
              }
              $scope.registered = data
              $('#studentName_auto').autocomplete({
                data: cmpdata,
                limit: 20,
                onAutocomplete: function (val) {
                  $scope.studentName = val
                  sdk.ListPhones((stat, data) => {
                    switch (stat) {
                      case sdk.stats.OK:
                        for (var i = 0; i < data.length; i++) {
                          if (!data[i].phonecode) continue
                          switch (data[i].type) {
                            case 'parent1':
                              $scope.studentParentPhone1 = `${data[i].phonecode}${data[i].number}`
                              break
                            case 'parent2':
                              $scope.studentParentPhone2 = `${data[i].phonecode}${data[i].number}`
                              break
                            case 'home':
                              $scope.studentHomePhone = `${data[i].phonecode}${data[i].number}`
                              break
                            case 'mobile':
                              $scope.studentPhone = `${data[i].phonecode}${data[i].number}`
                              break
                            default:
                          }
                        }
                        break
                      default:

                    }
                  }, data[val])
                },
                minLength: 1
              })
            }
            cmpdata = {}
            break
          default:

        }
      })
    }
  }
  $scope.load_optGroups = () => {
    if (isNaN($scope.opt_grade)) return
    sdk.ListGroups($scope.opt_grade, (stat, groups) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.opt_groups = groups
          break
        default:
      }
    })
  }
  $scope.load_optGroups()
  $scope.loadGroups = (edit) => {
    sdk.ListGroups(parseInt(edit ? $scope.edit_selected_grade : $scope.selected_grade), (stat, groups) => {
      switch (stat) {
        case sdk.stats.OK:
          if (edit) {
            $scope.edit_groups = groups
            var arr = []
            for (var i = 0; i < groups.length; i++) {
              arr.push(groups[i].id)
            }
            if (edit) edit_groups_loaded(arr)
          } else $scope.groups = groups
          break
        default:
      }
    })
  }
  $scope.loadStudents = () => {
    sdk.ListStudents($scope.startnum, $scope.limit, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.students = result
          break
        default:
      }
    }, $scope.opt_grade, $scope.opt_group)
  }
  $scope.reset = () => {
    $scope.opt_group = null
    $scope.opt_grade = null
    $scope.saveOpts()
  }
  $scope.checkall = () => {
    $scope.globalcheck = $scope.selectall
  }

  function prepareAddStudent() {
    $scope.studentName = null;
    $scope.studentParentPhone1 = null;
    $scope.studentParentPhone2 = null;
    $scope.studentHomePhone = null;
    $scope.studentPhone = null;
    $scope.studentNotes = null;
    $scope.studentDiscount = null;
    resetModals();
  }
  $scope.addStudent = () => {
    var n = neutralizeName($scope.studentName)
    if (!n) return toast('من فضلك قم بادخال الاسم رباعياً', gradients.error)
    if (!$scope.selected_grade) return toast('من فضلك قم باختيار السنه و المجموعه')
    if (!$scope.selected_group) return toast('من فضلك قم باختيار المجموعه')
    let parent1phone = parsePhoneNumber($scope.studentParentPhone1)
    let parent2phone = parsePhoneNumber($scope.studentParentPhone2)
    let homephone = parsePhoneNumber($scope.studentHomePhone)
    let studentphone = parsePhoneNumber($scope.studentPhone)
    if ($scope.studentParentPhone1 && (!parent1phone || !parent1phone.phonecode)) return toast('تأكد من إدخال رقم ولى الأمر الأول صحيحاً!')
    if ($scope.studentParentPhone2 && (!parent2phone || !parent2phone.phonecode)) return toast('تأكد من إدخال رقم ولى الأمر الثانى صحيحاً!')
    if ($scope.studentHomePhone && (!homephone || !homephone.phonecode)) return toast('تأكد من إدخال رقم المنزل صحيحاً!')
    if ($scope.studentPhone && (!studentphone || !studentphone.phonecode)) return toast('تأكد من إدخال رقم الطالب صحيحاً!')

    function finishShit(id) {
      sdk.LinkStudent($scope.selected_grade, $scope.selected_group, id, function (stat, result) {
        switch (stat) {
          case sdk.stats.OK:
            sdk.CountStudents((stat, count) => {
              switch (stat) {
                case stats.OK:
                  var c = $scope.selectedPage_num
                  createPagination(count, true)
                  // stay in the same page
                  $scope.changePage(c + 1)
              }
            })
            $('#addStudent_modal')[0].M_Modal.close()
            toast('تم اضافه الطالب!')
            var phones = []
            if (parent1phone.phonecode) phones.push({
              'num': $scope.studentParentPhone1,
              'type': 'parent1'
            })
            if (parent2phone.phonecode) phones.push({
              'num': $scope.studentParentPhone2,
              'type': 'parent2'
            })
            if (homephone.phonecode) phones.push({
              'num': $scope.studentHomePhone,
              'type': 'home'
            })
            if (studentphone.phonecode) phones.push({
              'num': $scope.studentPhone,
              'type': 'mobile'
            })
            sdk.UpdateNotesAndDiscount(id, $scope.studentNotes, $scope.studentDiscount, (stat) => {
              var i = -1
              var addphone = () => {
                i++
                if (i < phones.length) {
                  var number = parsePhoneNumber(phones[i].num)
                  sdk.SetPhone(number.number, number.phonecode, phones[i].type, (stat) => {
                    addphone()
                  }, id)
                } else {
                  prepareAddStudent()
                }
              }
              addphone();
            });
            break
          case sdk.stats.Exists:
            toast('الطالب مضاف بالفعل!')
            break
          case sdk.stats.NonExisting:
            toast('هذا الطالب ﻻ ينتى إلى قاعدة البيانات!')
            break
        }
      }, () => {
        error()
      })
    }
    var reg = $scope.registered[n]
    if (reg) {
      finishShit(reg)
    } else {
      sdk.RegisterStudent(n, function (stat, result) {
        switch (stat) {
          case sdk.stats.OK:
            finishShit(result.id)
            break
          case sdk.stats.Exists:
            toast('هذا الطالب مسجل بقاعده البيانات بالفعل!')
            break
          case sdk.stats.Error:
            error()
            break
        }
      })
    }
  }
  var del_id
  var del_index
  /*$scope.OPEN_FUNCTION = () => {
      $('#MODAL_ID')[0].M_Modal.open()
  }
  $scope.CLOSE_FUNCTION = () => {
      $('#MODAL_ID')[0].M_Modal.close()
  }*/
  $scope.prepareDel = (s) => {
    del_id = s.id
    del_index = $scope.students.indexOf(s)
    $('#delete_modal')[0].M_Modal.open()
  }
  var last_delid
  $scope.removeStudent = () => {
    if (typeof del_id != 'number' || typeof del_index != 'number') return
    sdk.UnlinkStudent(del_id, function (stat) {
      switch (stat) {
        case sdk.stats.OK:
          var oldPageNum = $scope.selectedPage_num
          sdk.CountStudents((stat, count) => {
            switch (stat) {
              case stats.OK:
                var c = $scope.selectedPage_num
                createPagination(count, true)
                $scope.changePage($scope.students.length > 1 ? c + 1 : c)
            }
          })
          toast('تم حذف الطالب!', gradients.warm)
          break
        case sdk.stats.NonExisting:
          toast('الطالب غير مسجل لدى المدرس!', gradients.error)
          break
        default:
          error()
      }
      del_id = null
      del_index = null
    })
  }
  $scope.saveOpts = () => {
    $scope.reload()
    setCookie('limit', $scope.limit)
    setCookie('opt_grade', $scope.opt_grade)
    setCookie('opt_group', $scope.opt_group)
  }
  unloadInfo = () => {
    $scope.info_studentHomePhone = null
    $scope.info_studentPhone = null
    $scope.info_studentParentPhone1 = null
    $scope.info_studentParentPhone2 = null
    $scope.infoStudent = null
  }
  unloadStudent = () => {
    $scope.edit_studentParentPhone1 = null
    $scope.edit_studentParentPhone2 = null
    $scope.edit_studentHomePhone = null
    $scope.edit_studentPhone = null
    $scope.edit_studentParentPhone1Changed = null
    $scope.edit_studentParentPhone2Changed = null
    $scope.edit_studentHomePhoneChanged = null
    $scope.edit_studentPhoneChanged = null
    $scope.loadedStudent = null
  }
  $scope.loadInfo = (s) => {
    unloadInfo()
    sdk.GetStudent(s.studentid, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          if (!result) return toast('حدث خطا ما اثناء تحميل بيانات ...', gradients.error)
          for (var i = 0; i < result.payments.length; i++) {
            var payment = result.payments[i]
            if (!payment.payed) {
              result.payments[i].payClass = 'red-text darken-1'
              result.payments[i].payText = 'لم يدفعها'
            } else {
              var payedMoney = payment.payed + (payment.discount || 0)
              if (payedMoney > payment.price) {
                result.payments[i].payClass = 'green-text'
                result.payments[i].payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - payment.price) + ' جنيه'
              } else if (payedMoney < payment.price) {
                result.payments[i].payClass = 'purple-text'
                result.payments[i].payText = 'لم يدفع بالكامل متبقى ' + (payment.price - payedMoney) + ' جنيه'
              } else if (payedMoney == payment.price) {
                result.payments[i].payClass = 'blue-text'
                result.payments[i].payText = 'دفعها'
              }
            }
          }
          if (!result.groupinfo[0]) {
            result.groupinfo[0] = {
              name: 'تم حذف المجموعة التى سجل بها الطالب'
            }
            result.nogroup = true
          }
          result.codeName = idToCode(result.studentid)
          $scope.infoStudent = result
          for (var i = 0; i < result.phones.length; i++) {
            var phone = result.phones[i]
            if (!phone.phonecode) continue
            switch (phone.type) {
              case 'parent1':
                $scope.info_studentParentPhone1 = phone.phonecode + phone.number
                break
              case 'parent2':
                $scope.info_studentParentPhone2 = phone.phonecode + phone.number
                break
              case 'home':
                $scope.info_studentHomePhone = phone.phonecode + phone.number
                break
              case 'mobile':
                $scope.info_studentPhone = phone.phonecode + phone.number
                break
              default:
            }
          }
          $('#info_modal')[0].M_Modal.open()
          break
        default:
          toast('حدث خطا ما فى تحميل بيانات الطالب...', gradients.error)
      }
    })
  }
  $scope.loadStudent = (s) => {
    unloadStudent()
    $scope.editPhonesChanged = false
    sdk.GetStudent(s.studentid, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          if (!result) return toast('حدث خطا ما اثناء تحميل بيانات ...', gradients.error)
          $scope.loadedStudent = result
          $scope.loadedStudent.listIndex = $scope.students.indexOf(s)
          $scope.edit_studentName = result.fullname
          $scope.edit_selected_grade = result.grade
          $scope.edit_studentDiscount = result.discount;
          $scope.edit_studentNotes = result.notes;
          edit_groups_loaded = (indexes) => {
            $scope.edit_selected_group = result.group
          }
          $scope.loadGroups(true)
          for (var i = 0; i < result.phones.length; i++) {
            var phone = result.phones[i]
            if (!phone.phonecode) continue
            switch (phone.type) {
              case 'parent1':
                $scope.edit_studentParentPhone1 = phone.phonecode ? phone.phonecode + phone.number : ''
                break
              case 'parent2':
                $scope.edit_studentParentPhone2 = phone.phonecode ? phone.phonecode + phone.number : ''
                break
              case 'home':
                $scope.edit_studentHomePhone = phone.phonecode ? phone.phonecode + phone.number : ''
                break
              case 'mobile':
                $scope.edit_studentPhone = phone.phonecode ? phone.phonecode + phone.number : ''
                break
              default:
            }
          }
          $('#edit_modal')[0].M_Modal.open()
          break
        default:
          toast('حدث خطا ما فى تحميل بيانات الطالب...', gradients.error)
      }
    })
  }
  $scope.saveStudent = () => {

    function changeName(callback) {
      var n = neutralizeName($scope.edit_studentName)
      if (!n) {
        callback(false)
        return toast('من فضلك قم بادخال الاسم رباعياً', gradients.error)
      }
      sdk.RenameStudent($scope.loadedStudent.studentid, n, (stat) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.students[$scope.loadedStudent.listIndex].fullname = n
            callback(true)
            break
          default:
            callback(false)
        }
      })
    }

    function editLink(callback) {
      if (typeof $scope.edit_selected_grade != 'number') {
        return callback(false)
      }
      if (typeof $scope.edit_selected_group != 'number') {
        return callback(false)
      }

      sdk.EditStudentLink($scope.loadedStudent.id, $scope.edit_selected_grade, $scope.edit_selected_group, (stat) => {
        switch (stat) {
          case sdk.stats.OK:
            callback(true)
            break
          default:
            callback(false)
        }
      })
    }

    function changePhones(callback) {
      var number = parsePhoneNumber($scope.edit_studentParentPhone1)
      if (!number) return toast('تأكد من إدخال رقم ولى الأمر 1 صحيحاً!')
      sdk.SetPhone(number.number, number.phonecode, 'parent1', (stat, result) => {
        switch (stat) {
          case sdk.stats.OK:
            number = parsePhoneNumber($scope.edit_studentParentPhone2)
            if (!number) return toast('تأكد من إدخال رقم ولى الأمر 2 صحيحاً!')
            sdk.SetPhone(number.number, number.phonecode, 'parent2', (stat) => {
              switch (stat) {
                case sdk.stats.OK:
                  number = parsePhoneNumber($scope.edit_studentHomePhone)
                  if (!number) return toast('تأكد من إدخال رقم المنزل صحيحاً!')
                  sdk.SetPhone(number.number, number.phonecode, 'home', (stat, data) => {
                    switch (stat) {
                      case sdk.stats.OK:
                        number = parsePhoneNumber($scope.edit_studentPhone)
                        if (!number) return toast('تأكد من إدخال رقم الطالب صحيحاً!')
                        sdk.SetPhone(number.number, number.phonecode, 'mobile', (stat) => {
                          switch (stat) {
                            case sdk.stats.OK:
                              callback(true)
                              break
                            default:
                              callback(false)
                          }
                        }, $scope.loadedStudent.studentid, !$scope.edit_studentPhoneChanged)
                        break
                      default:
                        callback(false)
                    }
                  }, $scope.loadedStudent.studentid, !$scope.edit_studentHomePhoneChanged)
                  break
                default:
                  callback(false)
              }
            }, $scope.loadedStudent.studentid, !$scope.edit_studentParentPhone2Changed)
            break
          default:
            callback(false)
        }
      }, $scope.loadedStudent.studentid, !$scope.edit_studentParentPhone1Changed)
    }

    function updateExtra(callback) {
      sdk.UpdateNotesAndDiscount($scope.loadedStudent.studentid, $scope.edit_studentNotes, $scope.edit_studentDiscount, (stat) => {
        if (stat == sdk.stats.OK) {
          callback(true);
        }
      });
    }

    changePhones((successP) => {
      if (successP) {
        if ($scope.edit_studentName != $scope.loadedStudent.fullname) {
          changeName((successC) => {
            if ($scope.edit_selected_grade != $scope.loadedStudent.grade || $scope.edit_selected_group != $scope.loadedStudent.group) {
              editLink((successL) => {
                if (successC && successL) finish(true)
                else finish(false)
              })
            } else {
              finish(true)
            }
          })
        } else if ($scope.edit_selected_grade != $scope.loadedStudent.grade || $scope.edit_selected_group != $scope.loadedStudent.group) {
          editLink((successL) => {
            if (successL) finish(true)
            else finish()
          })
        } else finish(true)
      } else finish()
    })

    function finish(success) {
      updateExtra(successE => {
        $scope.loadedStudent = null;
        if (success) toast('تم حفظ بيانات الطالب بنجاح!')
        else toast('تعذر حفظ بيانات الطالب!', gradients.error)
        $('#edit_modal')[0].M_Modal.close()
      });
    }
  }
})

/*app.controller('superttCtrl', function($scope, sdk) {
    $scope.generate = function(settings, orient) {
        $scope.tt = []
        $scope.startTimes = []
        var settings = {
            "13": {
                "groups_count": 3,
                "classes_count": 2,
                "duration": 120,
                "break": 30
            },
            "12": {
                "groups_count": 1,
                "classes_count": 3,
                "duration": 90,
                "break": 15
            },
            "11": {
                "groups_count": 2,
                "classes_count": 2,
                "duration": 60,
                "break": 15
            }
        }
        sdk.GetSuperTTDefaults((stat, defs) => {
            switch (stat) {
                case stats.InvalidToken:
                    break

                case stats.OK:
                    var g_sets = ValidateGradesSettings(settings, defs.defaults.whours, defs.defaults.duration, defs.defaults.break)
                    if (g_sets.time) {

                    } else if (g_sets.maxBreak) {

                    } else {
                        var tt = generateTimetable(settings, defs.grades, defs.defaults, ValidateOrient(orient))
                        $scope.Math = Math
                        var startTimes = []
                        for (var i = 1; i < 8; i++) {
                            var day = tt[i.toString()]
                            if (!day) break
                            else {
                                for (var key in day) {
                                    if (startTimes.indexOf(day[key].start) < 0) startTimes.push(day[key].start)
                                }
                            }
                        }
                        startTimes.sort(function(a, b) {
                            return a - b
                        })
                        for (var i = 1; i < 8; i++) {
                            var day = tt[i.toString()]
                            if (!day) break
                            else {
                                for (var index = 0; index < day.length; index++) {
                                    if (day[index].start > startTimes[index]) {
                                        day.splice(index, 0, {
                                            placeholder: true
                                        })
                                    }
                                }
                            }
                        }
                        // set after processing !!!
                        $scope.tt = tt
                        $scope.startTimes = startTimes
                    }
                    break
                case stats.Error:
                default:

            }
        })
    }
});*/

function confirm(rootscope, sdk, name) {
  function def() {
    rootscope.navigate()
  }

  function students() {
    rootscope.navigate('app')
  }
  sdk.CheckToken(students, () => {}, def)
}

app.controller('mainCtrl', function ($rootScope, $scope, sdk) {
  $scope.tolog_name = 'اسم الطالب'
  $scope.toLogGroup = 'مجموعة الطالب'
  confirm($rootScope, sdk)
  $scope.grades_names = sdk.grades_names_long
  let first = true
  var init = (refreshing, result, type) => {
    var c = $scope.selected_grade
    $scope.grades = result
    $scope.selected_grade = c || result[0]
    if (first) {
      $scope.grade_changed(true, true, true, true)
      first = false
    } else $scope.grade_changed(type == 'groups', type == 'exams', false, type == 'groupslinks' || type == 'groups')
  }
  $rootScope.variableListeners.push(init)
  $rootScope.reloadVariables()
  arrayKeyToArray = (obj, key) => {
    let returner = []
    obj.forEach(element => {
      returner.push(element[key])
    })
    return returner
  }
  dayArrayToString = arr => {
    var str = ''
    arr.forEach(element => {
      if (str == '') str = $rootScope.weekdays[element]
      else str += ' و ' + $rootScope.weekdays[element]
    })
    return str
  }
  classesLinksToDayString = obj => {
    return dayArrayToString(arrayKeyToArray(obj, 'day'))
  }
  $scope.open_profile = () => {
    if ($scope.studentid) window.open('/profile/' + $scope.studentid)
    else toast('قم بتسجيل غياب طالب اولاً لتفتح ملفه من هنا!', gradients.error)
  }
  $scope.open_logs = () => {
    if ($scope.selected_class) window.open('/logs/' + $scope.selected_class.id)
    else window.open('/logs')
  }
  $scope.open_exam_logs = () => {
    if ($scope.selected_exam) window.open('/exam_logs/' + $scope.selected_exam.id)
    else window.open('/exam_logs')
  }
  $scope.prepareExamDel = (exam) => {
    $('#deleteExam_modal_main')[0].M_Modal.open()
    $scope.removeExam = () => {
      sdk.RemoveExam($scope.selected_exam.id, (stat) => {
        if (stat == sdk.stats.OK) {
          $rootScope.reloadVariables('exams')
          toast('تم حذف الإمتحان بنجاح!')
        } else toast('تعذر حذف الإمتحان!')
      })
    }
  }
  $scope.addExam = () => {
    if ($scope.newExam_name == null) return toast('من فضلك قم بإدخال اسم الإمتحان', gradients.error)
    if ($scope.addExam_selectedGrade == null) return toast('من فضلك قم بإختيار السنة', gradients.error)
    sdk.AddExam($scope.newExam_name, parseInt($scope.addExam_selectedGrade), $scope.newExam_max, $scope.newExam_redline, (stat) => {
      switch (stat) {
        case sdk.stats.OK:
          $rootScope.reloadVariables('exams')
          toast('تم إضافة الإمتحان بنجاح!')
          break
        default:
          toast('تعذر إضافة الإمتحان!', gradients.error)
      }
      $('#addExam_modal_main')[0].M_Modal.close()
    })
  }
  $scope.editExam = () => {
    if (!$scope.editExam_name) return toast('برجاء كتابة اسم الإمتحان!', gradients.error)
    if (!$scope.editExam_max) return toast('برجاء إدخال أعلى درجة للإمتحان!', gradients.error)
    if (!$scope.editExam_redline) return toast('برجاء إدخال الخط الأحمر للدرجات!', gradients.error)
    sdk.EditExam($scope.loadedExamId, $scope.editExam_name, $scope.editExam_max, $scope.editExam_redline, (stat) => {
      if (stat == sdk.stats.OK) {
        $rootScope.reloadVariables('exams')
        toast('تم تعديل الإمتحان بنجاح!')
      } else toast('تعذر تعديل الإمتحان!', gradients.error)
      $('#editExam_modal_main')[0].M_Modal.close()
    })
    $scope.loadedExamId = null
  }
  $scope.loadExam = (exam) => {
    sdk.GetExam($scope.selected_exam.id, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          $scope.editExam_name = result.name
          $scope.editExam_max = result.max_mark
          $scope.editExam_redline = result.redline
          $scope.loadedExamId = $scope.selected_exam.id
          $('#editExam_modal_main')[0].M_Modal.open()
          break
        default:
          toast('تعذر تحميل بيانات الإمتحان!', gradients.error)
      }
    })
  }
  var lastrefresh = null
  $scope.refreshClasses = () => {
    var now = Date.now()
    var dif = Math.floor((now - lastrefresh) / 1000)
    if (lastrefresh != null && dif < 5 /* 5 seconds threshold */ ) return toast('برجاء الانتظار ' + dif + ' ثوانى قبل الضغظ مرة اخرى', gradients.error)
    sdk.RefreshClaases((stat) => {
      switch (stat) {
        case stats.OK:
          toast('تم تحميل الحصص بنجاح!')
          break
        default:
          break
      }
      $scope.grade_changed(false, false, true, false)
      lastrefresh = now
    })
  }
  $scope.addClass = () => {
    sdk.InitializeClass($scope.selected_grade, new Date($('#class_date').val()), $scope.selected_classnum.classnum, $scope.addedClass, (stat, newid) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed(false, false, true, false)
        toast('تم إضافة الحصة بنجاح')
      }
    })
  }
  $scope.prepareClassDel = () => {
    if ($scope.selected_class) $('#deleteClass_modal')[0].M_Modal.open()
    else toast('لم تختار أى حصة!', gradients.error)
  }

  $scope.delete_class = () => {
    sdk.DeleteClass($scope.selected_class.id, (stat) => {
      if (stat == sdk.stats.OK) {
        $scope.grade_changed(false, false, true, false)
        toast('تم حذف الحصة بنجاح!')
      }
    })
  }
  $scope.grade_changed = (groups, exams, classes, grouplinks) => {
    if ($scope.selected_grade) {
      if (exams) sdk.ListExams(parseInt($scope.selected_grade), (stat, exams) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.exams = exams
            break
          default:
        }
      })
      if (groups) sdk.ListGroups(parseInt($scope.selected_grade), (stat, groups) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.groups = groups
            break
          default:
        }
      })
      if (classes) sdk.ListClasses(parseInt($scope.selected_grade), (stat, result) => {
        switch (stat) {
          case sdk.stats.OK:
            for (var i = 0; i < result.length; i++) {
              result[i].date = simpleDate(new Date(result[i].date))
              if (result[i].links) result[i].linksString = classesLinksToDayString(result[i].links)
            }
            $scope.classes = result
            break
          default:
        }
      })
      if (grouplinks) sdk.ListGroupClassesLinks(parseInt($scope.selected_grade), (stat, result) => {
        switch (stat) {
          case sdk.stats.OK:
            $scope.classesLinks = []
            for (let i = 0; i < result.links.length; i++) {
              if (result.links[i].links) result.links[i].linksString = classesLinksToDayString(result.links[i].links)
              $scope.classesLinks.push(result.links[i])
            }
            break
          default:
            break
        }
      })
    }
  }
  $rootScope.reloadClassesLinks = () => {
    $scope.grade_changed(false, false, false, true)
  }
  $scope.toggleLog = () => {
    if (!$scope.studentid) return toast('لم يسجل حضور اى طالب!', gradients.error)
    $scope.cancelled = !$scope.cancelled
    if ($scope.cancelled) {
      sdk.LogClass($scope.studentid, $scope.selected_class.id, $scope.selected_group.id, false, null, null, (stat) => {
        if (stat == sdk.stats.OK) {
          toast('تم إلغاء حضور الطالب!')
        } else toast('تعذر إلغاء حضور الطالب!', gradients.error)
      })
    } else {
      sdk.LogClass($scope.studentid, $scope.selected_class.id, $scope.selected_group.id, true, null, null, (stat) => {
        if (stat == sdk.stats.OK) {
          toast('تم إعادة تسجيل غياب الطالب!')
        } else toast('تعذر تسجيل حضور الطالب!', gradients.error)
      })
    }
  }
  let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
  })
  $scope.currentExam = {}
  $scope.currentClass = {}
  $scope.selectedLogger = 'class'
  scanner.addListener('scan', function (content) {
    var parsed = {}
    try {
      var parsed = JSON.parse(content)
    } catch (e) {
      return toast('هذا كود ﻻ يخص البرنامج!', gradients.error)
    }
    if (typeof parsed.id != 'number') return toast('هذا كود ﻻ يخص البرنامج!', gradients.error)
    if (typeof parsed.code != 'string') return toast('هذا كود ﻻ يخص البرنامج!', gradients.error)
    // TODO select between exam and class
    if (!$scope.selected_group && $scope.selectedLogger == 'class') return toast('برجاء إختيار المجموعة!', gradients.error)
    if (!$scope.selected_class && $scope.selectedLogger == 'class') return toast('برجاء إختيار الحصة!', gradients.error)
    if (!$scope.selected_exam && $scope.selectedLogger == 'exam') return toast('برجاء إختيار الامتحان!', gradients.error)
    $scope.studentid = parsed.id
    $scope.cancelled = false
    sdk.BriefLog($scope.studentid, (stat, result) => {
      $scope.currentExam = null
      $scope.currentClass = null
      if (stat == sdk.stats.OK) {
        if (result.data.grade != $scope.selected_grade) return toast('الطالب من صف آخر!', gradients.error)
        $scope.toLogGrade = $scope.selected_grade
        $scope.tolog_name = result.data.fullname
        $scope.toLogGroup = result.data.group_name
        for (var i = 0; i < result.classes.length; i++) {
          result.classes[i].date = simpleDate(result.classes[i].date)
        }
        if ($scope.selected_exam) {
          for (let i = 0; i < result.exams.length; i++) {
            const exam = result.exams[i]
            if (exam.id == $scope.selected_exam.id) {
              $scope.currentExam = exam
              delete result.exams[i]
            }
          }
        }
        if ($scope.selected_class) {
          for (let i = 0; i < result.classes.length; i++) {
            const cc = result.classes[i]
            if (cc.id == $scope.selected_class.id) {
              $scope.currentClass = cc
              delete result.classes[i]
            }
          }
        }
        $scope.last_exams = result.exams
        $scope.last_classes = result.classes
        if ($scope.selectedLogger == 'class') {
          if (result.data.group_id != $scope.selected_group.id) {
            $rootScope.overlayStatus = 'مجموعة أخرى!'
            $('#overlay').css('color', 'red')
          }
          sdk.LogClass($scope.studentid, $scope.selected_class.id, $scope.selected_group.id, true, null, null, (stat, result) => {
            if (stat == sdk.stats.OK) {
              $rootScope.overlayProp = 'ok'
              if (!$rootScope.overlayStatus) $rootScope.overlayStatus = 'الطالب ملتزم'
              $('#overlay').css('opacity', 0.5)
              $('#overlay').show()
              setTimeout(() => {
                $('#overlay').animate({
                  opacity: 0
                }, 1000, function () {
                  $('#overlay').hide()
                  $rootScope.overlayStatus = null
                  $('#overlay').css('color', 'white')
                })
              }, 3000)
            } else toast('تعذر تسجيل حضور الطالب!', gradients.error)
          })
        } else if ($scope.selectedLogger == 'exam') {
          sdk.LogExam($scope.studentid, $scope.selected_exam.id, true, null, (stat) => {
            if (stat == sdk.stats.OK) {
              $rootScope.overlayProp = 'ok'
              if (!$rootScope.overlayStatus) $rootScope.overlayStatus = 'الطالب ملتزم'
              $('#overlay').css('opacity', 0.5)
              $('#overlay').show()
              setTimeout(() => {
                $('#overlay').animate({
                  opacity: 0
                }, 1000, function () {
                  $('#overlay').hide()
                  $rootScope.overlayStatus = null
                  $('#overlay').css('color', 'white')
                })
              }, 3000)
            } else toast('تعذر تسجيل حضور الطالب!', gradients.error)
          })
        }
      } else if (stat == sdk.stats.UserNonExisting) {
        // TODO 'الطالب مش موجود عند المدرس'
      }
    }, $scope.selected_class ? $scope.selected_class.id : null, $scope.selected_exam ? $scope.selected_exam.id : null)
  })
  $scope.camera_changed = () => {
    if ($rootScope.camera_enabled) scanner.start($scope.selected_camera)
    else scanner.stop()
  }
  $scope.toggleCamera = () => {
    $rootScope.camera_enabled = !$rootScope.camera_enabled
    $scope.camera_changed()
  }
  var set_camera = (val) => {
    $rootScope.camera_enabled = val
    $scope.camera_changed()
  }
  $rootScope.setCamera = set_camera
  Instascan.Camera.getCameras().then(function (cameras) {
    $scope.cameras = cameras
    $scope.selected_camera = cameras[0]
    // $rootScope.camera_enabled = true
    $scope.camera_changed()
  }).catch(function (e) {
    console.error(e)
  })
})

app.controller('settingsCtrl', function ($rootScope, $scope, sdk) {
  $scope.grades_names = sdk.grades_names
  // $rootScope.variableListeners.push()
  $scope.all_grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  var gs
  try {
    gs = JSON.parse(Cookies.get('grades'))
  } catch (e) {}
  if (!gs) {
    gs = {
      'g0': false,
      'g1': false,
      'g2': false,
      'g3': false,
      'g4': false,
      'g5': false,
      'g6': false,
      'g7': false,
      'g8': false,
      'g9': false,
      'g10': false,
      'g11': true,
      'g12': true,
      'g13': true
    }
    Cookies.set('grades', gs, {
      path: '/'
    }, {
      expires: 9999
    })
    $scope.selected_grades = gs
  } else $scope.selected_grades = gs
  $scope.toggledGrade = () => {
    Cookies.set('grades', $scope.selected_grades, {
      path: '/'
    }, {
      expires: 9999
    })
    $rootScope.allowedGradesChanged()
  }
  /* library.js */
  var ValidateString = function (str, limit) {
    if (!str || typeof str != 'string') return false
    if (limit) {
      if (str.length <= limit) return true
      else return false
    }
    if (arguments.callee.limit) {
      if (str.length <= arguments.callee.limit) return true
      else return false
    }
    return true
  }
  var ValidatePassword = function (obj) {
    if (!validators.ValidateString(obj)) {
      return false
    } else {
      if (obj.length < 8) return false
      else return true
    }
  }
  /* end library.js */
  $scope.prepChange = () => {
    var wanna_return = false
    if (!$scope.oldpassword || !ValidatePassword($scope.oldpassword)) {
      $('#oldpassword').addClass('invalid')
      wanna_return = true
    }
    if (!$scope.password || !ValidatePassword($scope.password)) {
      $('#password').addClass('invalid')
      wanna_return = true
    }
    if (!$scope.password2 || !ValidatePassword($scope.password2)) {
      $('#password2').addClass('invalid')
      wanna_return = true
    }
    if ($scope.password != $scope.password2) {
      $('#password').addClass('invalid')
      $('#password2').addClass('invalid')
      toast('كلمات المرور ﻻ تتطابق!', gradients.error)
      wanna_return = true
    }
    if (wanna_return) return
    $('#confirmChangePassword_modal')[0].M_Modal.open()
  }

  $scope.changePass = () => {
    sdk.ChangePassword($scope.password, $scope.oldpassword, (stat, result) => {
      switch (stat) {
        case sdk.stats.OK:
          toast('تم إعادة تعيين كلمة المرور بنجاح!')
          $rootScope.logout()
          break
        case sdk.stats.WrongPassword:
          $('#oldpassword').addClass('invalid')
          toast('كلمة المرور خاطئة!', gradients.error)
          break
        default:
          toast('تعذر إعادة تعيين كلمة المرور!', gradients.error)
      }
    })
  }

  $scope.addGrading = () => {
    const length = $scope.gradings.length;
    let obj;

    if (length > 0) {
      const lastGrading = $scope.gradings[length - 1];
      let newGrading = lastGrading.percentage - 10;

      if (newGrading < 0) {
        newGrading = 0;
      }

      obj = {
        name: 'تقدير جديد',
        percentage: newGrading,
      };
    } else {
      obj = {
        name: 'ممتاز',
        percentage: 90,
      };
    }
    $scope.gradings.push(obj);
  }

  $scope.removeGrading = (index) => {
    $scope.gradings.splice(index, 1);
  }

  $scope.updateGradings = () => {
    sdk.UpdateGradings(JSON.parse(angular.toJson($scope.gradings)), (stat) => {
      if (stat == sdk.stats.OK) {
        toast('تم الحفظ بنجاح');
      } else {
        toast('حدث خطأ ما اثناء حفظ البيانات');
      }
    });
  }

  sdk.GetGradings((stat, result) => {
    if (stat == sdk.stats.OK) {
      $scope.gradings = result.gradings || [];
    }
  })

  sdk.GetNameAndSubject((stat, result) => {
    $scope.teacherName = result.name
    $scope.subjects = result.subjects;
  })

  $scope.updateNameAndSubject = () => {
    if ($scope.teacherName == null) return toast('برجاء ادخال اسم المدرس')
    if ($scope.subjects == null) return toast('برجاء كتابة اسم المواد')

    sdk.UpdateNameAndSubject($scope.teacherName, $scope.subjects, (stat) => {
      switch (stat) {
        case sdk.stats.OK:
          toast('تم حفظ البيانات بنجاح')
          break
        default:
          toast('حدث خطأ أثناء حفظ البيانات')
          break
      }
    })
  }
})