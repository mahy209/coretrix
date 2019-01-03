var sdk = angular.module('coretrix.sdk', [])
const host = "127.0.0.1";
const port = 8080;
const local_url = "http://" + host + ":" + port + "/";
const live_url = 'http://80.211.107.128:8080/';
if (livenotlocal) url = live_url;
else url = local_url;

const subjects = {
  1: "اللغة العربية",
  2: "اللغة الانجليزية",
  3: "العلوم",
  4: "الدراسات الاجتماعية",
  5: "الحاسب الآلى",
  6: "الرياضيات",
  7: "اللغة الألمانية",
  8: "اللغة الفرنسية",
  9: "التربية الدينية الإسلامية",
  10: "التربية الدينية المسيحية",
  11: "الفيزياء",
  12: "الكيمياء",
  13: "الجيولوجيا",
  14: "الأحياء",
  15: "التربية الفنية",
  16: "التاريخ",
  17: "الجغرافيا",
  18: "الاقتصاد",
  19: "الفلسفة",
  20: "التربية وطنية",
  21: "العلم نفس",
  22: "الاحصاء",
};

const itemCategories = ["paper", "book", "revision", "subscription", "course"];
const itemCategoryNames = {
  paper: 'ورق',
  book: 'ملازم',
  revision: 'مراجعات',
  addedClasses: 'حصص إضافية',
  course: 'كورسات',
  subscription: 'الشهر'
}
/*const grades_names = [
    "حضانة 1",
    "حضانة 2",
    "1ب",
    "2ب",
    "3ب",
    "4ب",
    "5ب",
    "6ب",
    "1ع",
    "2ع",
    "3ع",
    "1ث",
    "2ث",
    "3ث"
];*/

const stats = {
  OK: 0,
  InvalidToken: 1,
  Exists: 2,
  NonExisting: 3,
  Error: 4,
  UserNonExisting: 5,
  WrongPassword: 6,
  TargetUserNonExisting: 7,
  NoMethodFound: 8,
  EmptyData: 9,
  Missing: 10,
  AddressExists: 11,
  MapExists: 12,
  PhoneExists: 13,
  InvalidData: 14,
  UnableToRetrieve: 15,
  NotStudent: 16,
  OrderNonExisting: 17,
  NotPayed: 18,
  ReturnOrderPending: 19,
  PlacedReturnOrder: 20,
  NotTeacher: 21,
  NoEnoughMoney: 22,
  AlreadyFollowed: 23,
  NotFollowed: 24,
  Associated: 25,
  BidClosed: 26,
  UpToDate: 27,
  RangesDontMatch: 28,
  Continue: 29,
  UploadCompleted: 30,
  AlreadyUploaded: 31,
  FileNotFound: 32,
  NotPermitted: 33,
  InvalidPhoneKeys: 34,
  Used: 35,
  PassedFunction: 36,
  IncapableUserType: 37,
  UnspecifiedGrade: 38,
  ChecksumsDontMatch: 39,
  SizesDontMatch: 40,
  NothingHappened: 41,
  InvalidHeaders: 42,
  NotReady: 43,
  UploadFailed: 44,
  FilesNotFound: 45,
  UnspecifiedDays: 46,
  UnspecifiedDefaults: 47,
  UnspecifiedWorkingHours: 48,
  UnspecifiedGrades: 49,
  NeedExtraTime: 50,
  NeedExtraOptions: 51,
  InvalidJSON: 52
}

//TODO development only

/*for (var k in stats) {
    stats[k] = k;
}*/

const notifications = {
  BidRemoval: 0,
  BidEdit: 1
}

function writeAPIRequest(obj) {
  return JSON.stringify(obj);
}

function readAPIRequest(body) {
  //return JSON.parse(body);
  return body;
}

Function.prototype.clone = function () {
  var that = this;
  var temp = function temporary() {
    for (var key in arguments.callee) {
      if (arguments.callee.hasOwnProperty(key)) {
        that[key] = arguments.callee[key];
      }
    }
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

var validators = {
  ValidateString: function (str, limit) {
    if (!str || typeof str != 'string') return false;
    if (limit) {
      if (str.length <= limit) return true;
      else return false;
    }
    return true;
  },
  ValidateNumber: function (number) {
    return (typeof number == 'number');
  },
  ValidateNumberString: function (str) {
    if (!str || typeof str != 'string') return false;
    var regex = /^[0-9]*$/
    return regex.test(str);
  },
  ValidateFromValues: function (obj, vals) {
    return (vals.indexOf(obj) > -1);
  },
  ValidateEmail: function (obj) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(obj)) {
      return true;
    }
    return false;
  },
  ValidatePassword: function (obj) {
    if (!validators.ValidateString(obj)) {
      return false;
    } else {
      if (obj.length < 8) return false;
      else return true;
    }
  },
}

sdk.factory('sdk', ['$http', function ($http) {
  function post(path, data, callback, redirectall) {
    var post_data = writeAPIRequest(data);
    var req = {
      method: 'POST',
      url: url + path,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: post_data
    }
    $http(req).then(function successCallback(response) {
      if (!redirectall) defaultStat(stats, response.data, callback, error);
      else callback(response.data.stat, response.data.result);
    }, function errorCallback(response) {
      callback(stats.Error);
    });
  }

  function _isAlive(token, callback) {
    post("api/alive", {
      token: token
    }, callback, true);
  }

  function CheckToken(student, teacher, def) {
    var token = localStorage.getItem('token');
    if (token) {
      _isAlive(token, function (stat, result) {
        switch (stat) {
          case stats.OK:
            switch (result.usertype) {
              case 'student':
                student();
                break;
              case 'teacher':
                teacher();
                break;
              default:
                def();
            }
            break;
          default:
            def();
        }
      });
    } else {
      def();
    }
  }

  function Register(displayname, username, password, email, usertype, callback) {
    post("api/register", {
      displayname: displayname,
      username: username,
      password: password,
      email: email,
      usertype: usertype
    }, callback);
  }

  function Authorize(login, password, device, model, callback) {
    post("api/authorize", {
      login: login,
      password: password,
      device: device,
      model: model
    }, callback);
  }

  function GetTokens(callback) {
    var token = localStorage.getItem('token');
    post("api/tokens/get", {
      token: token
    }, callback);
  }

  function Deauthorize(unique, callback) {
    var token = localStorage.getItem('token');
    post("api/deauthorize", {
      unique: unique,
      token: token
    }, callback);
  }

  function ChangePassword(password, oldpassword, callback) {
    var token = localStorage.getItem('token');
    post("api/password/change", {
      password: password,
      oldpassword: oldpassword,
      token: token
    }, callback);
  }
  /*function AddPhone(phonecode, number, callback) {
      var token = localStorage.getItem('token');
      post("api/phones/add", {
          phonecode: phonecode,
          number: number,
          token: token
      }, callback);
  }

  function GetPhones(callback, ids, startid, limit) {
      var token = localStorage.getItem('token');
      var req = {
          token: token
      };
      if (startid) req.startid = startid;
      if (limit) req.limit = limit;
      if (ids) req.ids = ids;
      post("api/phones/get", req, callback);
  }

  function RemovePhones(d_ids, callback) {
      var token = localStorage.getItem('token');
      post("api/phones/remove", {
          d_ids: d_ids,
          token: token
      }, callback);
  }*/

  function GetSuperTTDefaults(callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/supertt/defaults/get", {
      token: token
    }, callback);
  }

  function ListStudents(startid, limit, callback, grade, group, getcontacts) {
    var token = localStorage.getItem('token');
    var query = {
      students_limit: limit,
      startid: startid,
      token: token
    };
    if (!(isNaN(grade) || grade == null)) query.ig_grades = [grade];
    if (!(isNaN(group) || group == null)) query.ig_groups = [group];
    if (getcontacts) query.ig_getcontacts = getcontacts;
    post("api/teacher/students/list", query, callback);
  }

  function ListContacts(callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/contacts/list", {
      token
    }, callback);
  }

  function QRListStudents(grade, group, callback) {
    var token = localStorage.getItem('token');
    var query = {
      token: token
    };
    if (!(isNaN(grade) || grade == null)) query.ig_grades = [grade];
    if (!(isNaN(group) || group == null)) query.ig_groups = [group];
    post("api/teacher/students/qrlist", query, callback);
  }

  function GetStudent(targetuser, callback, getpayments) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/get", {
      targetuser: parseInt(targetuser),
      getpayments: getpayments ? true : false /* can be undefined and I'm too lazy to check if that's okay with the server's validator */ ,
      token: token
    }, callback);
  }

  function GetGrades(callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/grades/get", {
      token: token
    }, callback);
  }

  function GetGradeMonths(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/grades/months", {
      grade: grade,
      token: token,
    }, callback);
  }

  function ADBListDevices(callback) {
    var token = localStorage.getItem('token');
    post("api/adb/devices/list", {
      token: token,
    }, callback);
  }

  function ADBSendSMS(serial, recipient, message, protocol, callback) {
    var token = localStorage.getItem('token');
    post("api/adb/sms/send", {
      serial: serial,
      recipient: recipient,
      message: message,
      adb_protocol: protocol,
      threshold: 30,
      token: token,
    }, callback);
  }

  function getNameAndSubject(callback) {
    var token = localStorage.getItem('token');
    post("api/profile/get", {
      token: token,
    }, callback);
  }

  function updateNameAndSubject(name, subjects, callback) {
    var token = localStorage.getItem('token');
    post("api/profile/updatens", {
      fullname: name,
      subjects: subjects,
      token: token,
    }, callback);
  }

  function GetNotesAndDiscount(id, callback) {
    var token = localStorage.getItem('token');
    post("api/students/extra", {
      id: id,
      token: token,
    }, callback);
  }

  function UpdateNotesAndDiscount(id, notes, studentDiscount, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/extra", {
      id: id,
      notes: notes,
      studentDiscount: studentDiscount,
      token: token,
    }, callback);
  }


  function getGradings(callback) {
    var token = localStorage.getItem('token');
    post("api/profile/gradings/get", {
      token,
    }, callback);
  }

  function updateGradings(gradings, callback) {
    var token = localStorage.getItem('token');
    post("api/profile/gradings/update", {
      gradings,
      token,
    }, callback);
  }

  function AddExam(name, grade, max, redline, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/exams/add", {
      name: name,
      grade: grade,
      max: max,
      redline: redline,
      token: token
    }, callback);
  }

  function EditExam(id, name, max, redline, callback) {
    var token = localStorage.getItem('token');
    var query = {
      id: id,
      token: token
    };
    if (name) query.ig_name = name;
    if (redline) query.ig_redline = redline;
    if (max) query.ig_max = max;
    post("api/teacher/exams/edit", query, callback);
  }

  function ListExams(grade, callback, getdata) {
    var token = localStorage.getItem('token');
    var query = {
      token: token
    };
    if (!isNaN(grade)) query.ig_grades = [grade];
    if (!isNaN(getdata)) query.getdata = getdata;
    post("api/teacher/exams/get", query, callback);
  }

  function GetExam(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/exams/getone", {
      id: parseInt(id),
      token: token
    }, callback);
  }

  function RemoveExam(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/exams/remove", {
      id: id,
      token: token
    }, callback);
  }

  function ListGroups(grade, callback, distinct) {
    var token = localStorage.getItem('token');
    var query = {
      token: token
    };
    if (!isNaN(grade)) query.ig_grades = [grade];
    post("api/teacher/groups/" + (distinct ? 'distinct' : 'list'), query, callback);
  }

  function LinkGroupClasses(grade, classnum, groupid, groupday, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/groups/link", {
      grade: grade,
      classnum: classnum,
      groupid: groupid,
      groupday: groupday,
      token: token
    }, callback);
  }

  function RemoveGroupClass(groupid, groupday, grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/groups/remove", {
      grade: grade,
      groupid: groupid,
      groupday: groupday,
      token: token
    }, callback);
  }

  function GetGroup(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/groups/get", {
      id: id,
      token: token
    }, callback);
  }

  function CountGroupsLinks(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/countlinked", {
      grade: grade,
      token: token
    }, callback);
  }

  function CreateGroup(name, grade, schedule, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/groups/create", {
      name: name,
      grade: grade,
      schedule: schedule,
      token: token
    }, callback);
  }

  function EditGroup(id, name, schedule, callback) {
    var token = localStorage.getItem('token');
    var query = {
      id: parseInt(id),
      token: token
    }
    if (name) query.ig_name = name;
    if (schedule) query.ig_schedule = schedule;
    post("api/teacher/groups/edit", query, callback);
  }

  function RemoveGroup(groupid, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/groups/remove", {
      groupid: groupid,
      token: token
    }, callback);
  }

  function RefreshClaases(callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/refresh", {
      token: token
    }, callback);
  }

  function SearchStudents(name, callback, grades, search_limit, startid) {
    var token = localStorage.getItem('token');
    var query = {
      name: name,
      search_limit: search_limit ? search_limit : 5,
      startid: startid ? startid : 0,
      token: token
    };
    if (grades) query.ig_grades = grades;
    post("api/search/students", query, callback);
  }

  function RegisterStudent(fullname, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/register", {
      fullname: fullname,
      token: token
    }, callback);
  }

  function LinkStudent(grade, group, studentid, callback, error) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/link", {
      grade: parseInt(grade),
      group: parseInt(group),
      student: studentid,
      token: token
    }, callback, error);
  }

  function EditStudentLink(linkid, grade, group, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/edit", {
      grade: parseInt(grade),
      group: parseInt(group),
      id: linkid,
      token: token
    }, callback);
  }

  function UnlinkStudent(linkid, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/unlink", {
      linkid: linkid,
      token: token
    }, callback);
  }

  function SetPhone(number, phonecode, phonetype, callback, targetuser, cancel) {
    if (cancel) return callback(stats.OK);
    var token = localStorage.getItem('token');
    var query = {
      targetuser: targetuser || null,
      phonetype: phonetype,
      token: token
    }
    if (number) query.number = number;
    if (phonecode) query.phonecode = phonecode;
    if (!number || !phonecode) query.delete = true;
    post("api/phones/set", query, callback);
  }

  function RemovePhones(ids, callback, targetuser) {
    var token = localStorage.getItem('token');
    post("api/phones/remove", {
      targetuser: targetuser || null,
      ids: ids,
      token: token
    }, callback);
  }

  function ListPhones(callback, targetuser) {
    var token = localStorage.getItem('token');
    post("api/phones/list", {
      targetuser: targetuser || null,
      token: token
    }, callback);
  }

  function InitializeClass(grade, date, classnum, addedClass, callback) {
    var token = localStorage.getItem('token');
    var query = {
      grade: parseInt(grade),
      date: date,
      token: token
    };
    if (addedClass) query.ig_addedClass = true;
    if (typeof classnum == 'number') query.ig_classnum = classnum;
    post("api/teacher/classes/init", query, callback);
  }

  function ClearLog(targetuser, logtype, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/logs/clear", {
      targetuser: parseInt(targetuser),
      logtype: logtype,
      token: token
    }, callback);
  }

  function DeleteClass(classid, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/delete", {
      classid: classid,
      token: token
    }, callback);
  }

  function ListClasses(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/list", {
      grade: parseInt(grade),
      token: token
    }, callback);
  }

  function ListGroupClassesLinks(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/groups/links", {
      grade: parseInt(grade),
      token: token
    }, callback);
  }

  function GetClass(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/classes/get", {
      classid: parseInt(id),
      token: token
    }, callback);
  }

  function FetchLogs(student, grade, datePeriod, callback) {
    var token = localStorage.getItem('token');
    var query = {
      targetuser: parseInt(student),
      grade: grade,
      token: token
    };
    if (datePeriod) query.datePeriod = datePeriod;
    post("api/teacher/logs/fetch", query, callback);
  }

  function FetchLogsForParent(token, teacher, grade, datePeriod, callback) {
    var query = {
      grade: grade,
      teacher: teacher,
      parenttoken: token
    };
    if (datePeriod) query.datePeriod = datePeriod;
    post("api/parent/fetchlogs", query, callback);
  }

  function FetchExamLogs(classid, grade, callback, getcontacts) {
    var token = localStorage.getItem('token');
    let query = {
      id: parseInt(classid),
      grade: grade,
      token: token
    }
    if (getcontacts) query.ig_getcontacts = getcontacts;
    post("api/teacher/exams/fetchlogs", query, callback);
  }

  function FetchClassLogs(classid, grade, callback, getcontacts) {
    var token = localStorage.getItem('token');
    var query = {
      classid: parseInt(classid),
      grade: grade,
      token: token
    };
    if (getcontacts) query.ig_getcontacts = getcontacts;
    post("api/teacher/classes/fetchlogs", query, callback);
  }

  function BriefLog(student, callback, /*current_classid, current_examid*/ ) {
    var token = localStorage.getItem('token');
    var query = {
      targetuser: parseInt(student),
      token: token
    };
    /*if (typeof current_examid == 'number' && !isNaN(current_examid)) query.ig_examid = parseInt(current_examid);
    if (typeof current_classid == 'number' && !isNaN(current_classid)) query.ig_classid = parseInt(current_classid);*/
    post("api/teacher/logs/brief", query, callback);
  }

  function count(grade, group, callback) {
    var token = localStorage.getItem('token');
    var query = {
      token: token
    };
    if (typeof grade == 'number' && !isNaN(grade)) query.ig_grade = parseInt(grade);
    if (typeof group == 'number' && !isNaN(group)) query.ig_groupid = parseInt(group);
    post("api/count", query, callback);
  }

  function FetchPaymentLogs(itemid, grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/payments/fetchlogs", {
      itemid: parseInt(itemid),
      grade: grade,
      token: token
    }, callback);
  }

  function AddPayLog(name, payed, date, callback) {
    var token = localStorage.getItem('token');
    let query = {
      payedAmount: payed,
      name: name,
      date: date,
      token: token
    };
    post("api/teacher/paylogs/add", query, callback);
  }

  function SetPayLog(_id, payed, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/paylogs/set", {
      _id: _id,
      payedAmount: payed,
      token: token
    }, callback);
  }

  function ListPayments(date, comparingDate, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/payments/list", {
      date: date,
      comparingDate: comparingDate,
      token: token
    }, callback);
  }

  function SetPaymentLog(itemid, studentid, payedAmount, discount, callback) {
    var token = localStorage.getItem('token');
    var query = {
      itemid: parseInt(itemid),
      student: parseInt(studentid),
      payedAmount: parseInt(payedAmount),
      discount: discount,
      token: token
    };
    post("api/teacher/payments/set", query, callback);
  }

  function CreateGrade(name, callback) {
    const token = localStorage.getItem('token');
    post("api/grades/create", {
      name,
      token,
    }, callback);
  }

  function GetBeeps(callback) {
    const token = localStorage.getItem('token');
    post("api/teacher/beeps", {
      token,
    }, callback);
  }

  function UpdateBeeps(beeps, callback) {
    const token = localStorage.getItem('token');
    post("api/teacher/beeps/update", {
      token,
      beeps,
    }, callback);
  }

  function ListGrades(callback) {
    const token = localStorage.getItem('token');
    post("api/grades/list", {
      token,
    }, callback);
  }

  function UpdateGrade(id, name, callback) {
    const token = localStorage.getItem('token');
    post("api/grades/update", {
      id,
      name,
      token,
    }, callback);
  }

  function DeleteGrade(id, callback) {
    const token = localStorage.getItem('token');
    post("api/grades/delete", {
      id,
      token,
    }, callback);
  }

  function AddItem(name, grade, price, itemCategory, month, year, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/items/add", {
      name,
      grade: parseInt(grade),
      price,
      itemCategory: itemCategory,
      month,
      year,
      token: token
    }, callback);
  }

  function GetItem(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/items/get", {
      itemid: parseInt(id),
      token: token
    }, callback);
  }

  function DeleteItem(id, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/items/remove", {
      itemid: parseInt(id),
      token: token
    }, callback);
  }

  function ListItems(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/items/list", {
      grade: parseInt(grade),
      token: token
    }, callback);
  }

  function ListCategories(grade, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/items/listcategories", {
      grade: parseInt(grade),
      token: token
    }, callback);
  }

  function RequestParentToken(code, callback) {
    post("api/parent/request", {
      code: code
    }, callback);
  }

  function GetInfoForParent(token, callback) {
    post("api/parent/info", {
      parenttoken: token
    }, callback);
  }

  function GetLinks(targetuser, callback) {
    var token = localStorage.getItem('token');
    post("api/report/links/get", {
      targetuser: targetuser,
      token: token
    }, callback);
  }

  function SetStartDate(grade, date, allback) {
    var token = localStorage.getItem('token');
    post("api/teacher/defaults/startdates/set", {
      grade: grade,
      date: date,
      token: token
    }, callback);
  }

  function ListStartDates(callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/defaults/startdates/get", {
      token: token
    }, callback);
  }

  function LogClass(student, classid, groupid, attendant, quiz, homework, callback) {
    var token = localStorage.getItem('token');
    var query = {
      classid: parseInt(classid),
      student: parseInt(student),
      token: token
    }
    if (typeof groupid == 'number' && !isNaN(groupid)) query.ig_groupid = parseInt(groupid);
    if (typeof attendant == 'boolean') query.ig_attendant = attendant;
    if (quiz) query.quiz = quiz;
    if (homework) query.homework = homework;
    console.log(query);
    post("api/teacher/classes/log", query, callback);
  }

  function LogExam(student, examid, attendant, mark, callback) {
    var token = localStorage.getItem('token');
    var query = {
      id: parseInt(examid),
      student: parseInt(student),
      token: token
    }
    if (typeof attendant == 'boolean') query.ig_attendant = attendant;
    if (typeof mark == 'number' && !isNaN(mark)) query.ig_mark = mark;
    post("api/teacher/exams/log", query, callback);
  }

  function CountStudents(callback, skip, groups, grades) {
    var token = localStorage.getItem('token');
    var query = {
      token: token
    };
    if (skip) query.startid = skip;
    if (grades) query.ig_grades = grades;
    if (groups) query.ig_groups = groups;
    post("api/teacher/students/count", query, callback);
  }

  function EditPhone(number, phonecode, phonetype, callback, targetuser) {
    var token = localStorage.getItem('token');
    post("api/phones/edit", {
      targetuser: targetuser || null,
      new_number: number,
      new_phonecode: phonecode,
      new_phonetype: phonetype,
      token: token
    }, callback);
  }

  function RenameStudent(id, newname, callback) {
    var token = localStorage.getItem('token');
    post("api/teacher/students/rename", {
      targetuser: id || null,
      fullname: newname,
      token: token
    }, callback);
  }
  var html = `
    <script type="text/javascript" src="/assets/js/libs/jquery-3.2.1.min.js"></script>
    <script>
      $(document).ready(() => { 
        window.print();
        window.close();
      });
    </script>
    <link type="text/css" rel="stylesheet" href="/assets/css/materialize.min.css" media="all" />
    <style>
        @import url('/assets/css/Cairo.css');
        body {
            font-family: 'Cairo', sans-serif;
        }
        .scale90 {
            zoom: 0.9;
            -moz-transform: scale(0.9);
        }
    </style>

    <body onload="step1()">
        <div class="row scale90" onload="step1()">
            <!--here-->
        </div>
    </body>`;

  function generatePrintingPageHtml(users) {
    var text = "";
    for (var i = 0; i < users.length; i++) {
      text += `<div class="col s3"><img src=${users[i].link}></img><div style="display: inline-flex; text-align:right; width: 100%"><p style="width:100%">${users[i].name}<i style="float:left; margin-right: 2%">${users[i].code + ' - ' + users[i].idCode}</i></p></div></div>`;
    }
    return html.replace("<!--here-->", text);
  }

  function GenerateBarcodeA4PrintHTML(users, A4, margin = 0) {
    console.log({margin});
    const barcodeHTML =
      `
    <html>

    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script type="text/javascript" src="/assets/js/libs/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="/assets/js/libs/barcode-generator.js"></script>
      <style>
        @import url('/assets/css/Cairo.css');

        body {
            font-family: 'Cairo', sans-serif;
        }
        
        .text-center {
          text-align: center;
        }
    
        .no-margin {
          margin: 0;
        }

        .row {
          width: 100%;
        }
        
        .col.s3 {
          display: inline-block;
          width: 24%;
        }
      </style>
      <script>
      $(document).ready(() => {
        ${users.map(user => {
          return `
          JsBarcode('#barcode${user.id}', '${user.id}', {
            displayValue: false,
            height: 40,
            margin: 0,
            marginTop: 20,
          });
          `;
        }).join('')}
        window.print();
        window.close();
      });
      </script>
    </head>
    
    <body>
      <div class="row">
        ${users.map(user => {
          return  `
          <div class="${A4 ? 'col s3' : ''} text-center" style="padding-top: ${margin}px; padding-bottom: ${margin}px">
            <svg id="barcode${user.id}"></svg>
            <p class="no-margin">
              ${user.name}
            </p>
          </div>
          `;
        }).join('')}
      </div>
    </body>
    
    </html>
    `;
    return barcodeHTML;
  }

  function GenerateReceipt(data) {
    const {
      id,
      fullname,
      profile,
      item,
      grade
    } = data;
    return `
    <html>

    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link type="text/css" rel="stylesheet" href="/assets/css/materialize.min.css" media="all" />
      <script type="text/javascript" src="/assets/js/libs/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="/assets/js/libs/barcode-generator.js"></script>
      <style>
        @import url('/assets/css/Cairo.css');
        
        body {
          font-family: 'Cairo', sans-serif;
          padding: 16px;
        }
    
        .text-center, .text-center * {
          text-align: center;
        }
    
        .text-right,
        .text-right * {
          text-align: right;
        }
    
        .no-margin {
          margin: 0;
        }
    
        td {
          padding: 0;
        }
      </style>
      <script>
      $(document).ready(() => {
        JsBarcode('#barcode', ${data.id}, {
          displayValue: false,
          height: 40,
          margin: 0,
          marginTop: 20,
        });
        window.print();
        window.close();
      })
      </script>
    </head>
    
    <body dir="rtl">
      <div class="row">
        <div class="col s12 text-center">
          <h5>ايصال دفع</h5>
          <h6>${profile.name} - ${profile.subjects}</h6>
          <h6>${moment().format('M/D/YYYY hh:mm A')}</h6>
        </div>
        <div class="col s12 text-center">
          <table class="text-right">
            <tbody>
              <tr>
                <td width="18%">الطالب</td>
                <td style="padding-right: 6px;">:</td>
                <td>${fullname}</td>
              </tr>
              <tr>
                <td>السنة</td>
                <td>:</td>
                <td>${grade}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col s12 text-center">
          <table class="text-right">
            <thead>
              <tr>
                <td>الوحدة</td>
                <td>السعر</td>
                <td>خصم</td>
                <td>المدفوع</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.discount}</td>
                <td>${item.payed}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col s12 text-center">
          <svg id="barcode"></svg>
        </div>
        <div class="col s12 text-center">
          <small>فريق جراى</small>
          <small>01096707442</small>
        </div>
      </div>
    </body>
    
    </html>
    `;
  }
  return {
    GeneratePrintingPageHtml: generatePrintingPageHtml,
    GenerateBarcodeA4PrintHTML,
    GenerateReceipt,
    // -----------------------------------------------------
    stats: stats,
    itemCategories: itemCategories,
    itemCategoryNames: itemCategoryNames,
    subjects: subjects,
    isAlive: _isAlive,
    validators: validators,
    CheckToken: CheckToken,
    Register: Register,
    Authorize: Authorize,
    GetTokens: GetTokens,
    Deauthorize: Deauthorize,
    SetPhone: SetPhone,
    ListPhones: ListPhones,
    EditPhone: EditPhone,
    RemovePhones: RemovePhones,
    GetSuperTTDefaults: GetSuperTTDefaults,
    SearchStudents: SearchStudents,
    ListStudents: ListStudents,
    GetGrades: GetGrades,
    ListGroups: ListGroups,
    GetGroup: GetGroup,
    RegisterStudent: RegisterStudent,
    LinkStudent: LinkStudent,
    GetStudent: GetStudent,
    UnlinkStudent: UnlinkStudent,
    RenameStudent: RenameStudent,
    EditStudentLink: EditStudentLink,
    CountStudents: CountStudents,
    CreateGroup: CreateGroup,
    RemoveGroup: RemoveGroup,
    AddExam: AddExam,
    ListExams: ListExams,
    RemoveExam: RemoveExam,
    InitializeClass: InitializeClass,
    DeleteClass: DeleteClass,
    ListClasses: ListClasses,
    FetchLogs: FetchLogs,
    BriefLog: BriefLog,
    ClearLog: ClearLog,
    LogClass: LogClass,
    ChangePassword: ChangePassword,
    GetClass: GetClass,
    FetchClassLogs: FetchClassLogs,
    EditGroup: EditGroup,
    GetExam: GetExam,
    FetchExamLogs: FetchExamLogs,
    EditExam: EditExam,
    LogExam: LogExam,
    ListCategories: ListCategories,
    AddItem: AddItem,
    QRListStudents: QRListStudents,
    ListItems: ListItems,
    GetItem: GetItem,
    DeleteItem: DeleteItem,
    FetchPaymentLogs: FetchPaymentLogs,
    SetPaymentLog: SetPaymentLog,
    AddPayLog: AddPayLog,
    SetPayLog: SetPayLog,
    ListPayments: ListPayments,
    RequestParentToken: RequestParentToken,
    GetInfoForParent: GetInfoForParent,
    FetchLogsForParent: FetchLogsForParent,
    GetGradeMonths: GetGradeMonths,
    ADBListDevices: ADBListDevices,
    ADBSendSMS: ADBSendSMS,
    GetNameAndSubject: getNameAndSubject,
    UpdateNameAndSubject: updateNameAndSubject,
    GetGradings: getGradings,
    UpdateGradings: updateGradings,
    UpdateNotesAndDiscount: UpdateNotesAndDiscount,
    GetNotesAndDiscount: GetNotesAndDiscount,
    CreateGrade: CreateGrade,
    ListGrades: ListGrades,
    UpdateGrade: UpdateGrade,
    DeleteGrade: DeleteGrade,
    GetLinks: GetLinks,
    Count: count,
    GetBeeps,
    UpdateBeeps,
    /* ----------------------- */
    ListGroupClassesLinks: ListGroupClassesLinks,
    LinkGroupClasses: LinkGroupClasses,
    RemoveGroupClass: RemoveGroupClass,
    RefreshClaases: RefreshClaases,
    ListStartDates: ListStartDates,
    SetStartDate: SetStartDate,
    CountGroupsLinks: CountGroupsLinks,
    ListContacts,
  };
}])