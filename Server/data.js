//TODO test image uploading using pretty pics/test_subjects.jpg
//TODO create thumbnails for profile pics
//TODO schedule checks for unused files to be removed
//TODO schedule backup
//TODO disable Transparent Huge Pages (THP) on linux
//TODO don't make validate token return all the data

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

const itemCategoryNames = {
  paper: 'ورق',
  book: 'ملازم',
  revision: 'مراجعات',
  addedClasses: 'حصص إضافية',
  course: 'كورسات',
  subscription: 'الشهر'
}

const phonecodes = {
  "": {
    "english": "Hotline",
    "arabic": "خط ساخن"
  },
  "010": {
    "english": "Vodafone",
    "arabic": "فودافون"
  },
  "011": {
    "english": "Etisalat",
    "arabic": "إتصالات"
  },
  "012": {
    "english": "Orange",
    "arabic": "أورانج"
  },
  "02": {
    "english": "Cairo",
    "arabic": "القاهرة"
  },
  "03": {
    "english": "Alexandria",
    "arabic": "الأسكندرية"
  },
  "013": {
    "english": "Qalyubia",
    "arabic": "القليوبية"
  },
  "015": {
    "english": "10th of Ramadan",
    "arabic": "العاشر من رمضان"
  },
  "040": {
    "english": "Gharbia",
    "arabic": "الغربية"
  },
  "045": {
    "english": "Beheira",
    "arabic": "البحيرة"
  },
  "046": {
    "english": "Matruh",
    "arabic": "مرسى مطروح"
  },
  "047": {
    "english": "Kafr El-Sheikh",
    "arabic": "كفر الشيخ"
  },
  "048": {
    "english": "Monufia",
    "arabic": "المنوفية"
  },
  "050": {
    "english": "Dakahlia",
    "arabic": "الدقهلية"
  },
  "055": {
    "english": "Sharqia",
    "arabic": "الشرقية"
  },
  "057": {
    "english": "Damietta",
    "arabic": "دمياط"
  },
  "062": {
    "english": "Suez",
    "arabic": "السويس"
  },
  "064": {
    "english": "Ismailia",
    "arabic": "الإسماعيلية"
  },
  "065": {
    "english": "Red Sea",
    "arabic": "البحر الأحمر"
  },
  "066": {
    "english": "Port Said",
    "arabic": "بورسعيد"
  },
  "068": {
    "english": "North Sinai",
    "arabic": "شمال سيناء"
  },
  "069": {
    "english": "South Sinai",
    "arabic": "جنوب سيناء"
  },
  "082": {
    "english": "Beni Suef",
    "arabic": "بنى سويف"
  },
  "084": {
    "english": "Faiyum",
    "arabic": "الفيوم"
  },
  "086": {
    "english": "Minya",
    "arabic": "المنيا"
  },
  "088": {
    "english": "Asyut",
    "arabic": "أسيوط"
  },
  "092": {
    "english": "New Valley",
    "arabic": "الوادى الجديد"
  },
  "093": {
    "english": "Sohag",
    "arabic": "سوهاج"
  },
  "095": {
    "english": "Luxor",
    "arabic": "الأقصر"
  },
  "096": {
    "english": "Qena",
    "arabic": "قنا"
  },
  "097": {
    "english": "Aswan",
    "arabic": "أسوان"
  },
};
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
  InvalidJSON: 52,
  Failed: 53,
}
//TODO development only
/*for (var k in stats) {
    stats[k] = k;
}*/
const notifications = {
  Link: 0,
  Unlink: 1
}
const warns = {
  AnotherGrade: 0,
  TimetableCollision: 1,
  MoreThanOneSubject: 2,
  UnspecifiedBreak: 3,
  UnspecifiedFirstBreak: 4,
  NoRoomWithPattern: 5
}
// images, excel, pp, printing, word, text, archives
const filetypes = {
  images: 'images',
  excel: 'excel',
  pp: 'pp',
  printing: 'printing',
  word: 'word',
  text: 'text',
  archives: 'archives'
};
//TODO support all the other extensions
const extensions = {
  images: [
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'tiff'
  ],
  excel: [
    'csv',
    'xls',
    'xlsx'
  ],
  pp: [
    'ppt',
    'pps',
    'pptx',
    'ppsx'
  ],
  printing: [
    'xps'
  ],
  word: [
    'docx',
    'doc'
  ],
  text: [
    'rtf',
    'txt'
  ],
  archives: [
    'zip',
    'rar',
    '7z',
    'arc'
  ]
};

function SaveError(err) {
  var d = date();
  console.error("Error caught on: " + d);
  if (err) {
    if (err.err) err = err.err;
    //TODO debugging only
    console.log(err.message);
    console.log(err.stack);
  }
  try {
    fs.writeFile(__dirname + "/errors/" + d, arguments.callee.caller.toString() + "\n" + err.message + "\n" + ((err) ? err.stack : "null"), () => {})
  } catch (e) {
    console.log("Unable to save error file !");
    console.error(e.stack);
    console.log("The Error:");
    console.error(arguments.callee.caller.toString() + "\n" + err.message + "\n" + ((err) ? err.stack : "null"));
  }
}

const grades = {
  KG1: 0,
  KG2: 1,
  P1: 2,
  P2: 3,
  P3: 4,
  P4: 5,
  P5: 6,
  P6: 7,
  E1: 8,
  E2: 9,
  E3: 10,
  S1: 11,
  S2: 12,
  S3: 13
}

const bidTypes = {
  Classes: 0,
  Course: 1,
  Intensive: 2
}

var languages = [
  "ar",
  "en"
];

// const mcrypt = require('mcrypt').MCrypt;
const key = 'pJGnpW25u1lwivY0PshrIrH3vtgoYAB3';
const util = require('util');
const values = require('object.values');
const md5 = require('md5-file');
const performance_now = require("performance-now");
const path = require('path');
// compiling
// const bcrypt = require(path.join(process.cwd(), './bcrypt'));
// development
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const genPass = require('generate-password');
const lib = require(__dirname + "/library");
var CronJob = require('cron').CronJob;
var db;
const ip = require(__dirname + "/imageprocessor")
const mongoh = require(__dirname + "/mongoh");
var loaded = false;
const moment = require('moment')
const mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
const fs = require("fs");
const live_host = "80.211.107.128";
const live_port = 27017;
const live_user = "themadprogrammer";
const live_password = "loVeA6irl";
const live_database = "coretrix"
/*const live_host = "ds153577.mlab.com";
const live_port = 53577;
const live_user = "nodejs";
const live_password = "loVeA6irl";
const live_database = "coretrix"*/
/*const live_host = "mongodb.testu.svc";
const live_port = 27017;
const live_user = process.env.MONGODB_USER;
const live_password = process.env.MONGODB_PASSWORD;
const live_database = process.env.MONGODB_DATABASE;*/
const live_url = `mongodb://${live_user}:${live_password}@${live_host}:${live_port}/${live_database}`;
var local_url = 'mongodb://localhost:27017/coretrix';
var defParam = lib.defParam;
var now = lib.PerformanceLog;
var connecting = false;

function setLiveOrLocal(live, sdkLive = live) {
  let u = live ? live_url : local_url;
  try {
    fs.writeFileSync(path.join(path.dirname(__filename), 'assets/js/scripts/liveorlocal.js'), `var livenotlocal = ${sdkLive};`)
  } catch (e) {}
  return u;
}

function connect() {
  connecting = true;
  var u;
  try {
    if (process.env.DEV) {
      u = setLiveOrLocal(true, false);
    } else if (process.env.LIVE) {
      u = setLiveOrLocal(true);
    } else {
      u = setLiveOrLocal(false);
    }
  } catch (e) {
    u = setLiveOrLocal(false);
  }
  if (u == local_url) {
    console.log("Running on local database...");
  } else console.log("Running on live database...");
  console.log("connecting to: " + u + "...");
  MongoClient.connect(u, function (err, database) {
    connecting = false;
    if (!err) {
      db = database;
      loaded = true;
      console.log("Connected to '" + u + "' sucessfully");
      connected();
    } else {
      loaded = false;
      setTimeout(connect, 10000);
    }
  });
}

connect();

function getLoaded() {
  if (!loaded && !connecting) connect();
  return loaded;
}

var date = lib.jsDate;

/*var crypto = new mcrypt('rijndael-128', 'ecb');
crypto.open(key);

function encrypt(data) {
    return crypto.encrypt(data).toString('base64');
}

function decrypt(chiper) {
    return removeInvalidChars(crypto.decrypt(new Buffer(chiper, 'base64')).toString());
}*/

var identifier = "id";
var foreignIdentifier = "userid";
var teacherForeignIdentifier = "teacherid";
var studentForeignIdentifier = "studentid";

function id(userDoc) {
  return userDoc.id;
}
var student = id;

function teacher(userDoc) {
  return userDoc ? userDoc.teacherid : undefined;
}
var teacherRep = teacher;

function isAdmin(userDoc) {
  return userDoc.usertype == 'admin';
}

function isTeacher(userDoc) {
  return userDoc.usertype == 'teacher';
}

function isStudent(userDoc) {
  return userDoc.usertype == 'student';
}

function isTeacherRep(userDoc) {
  return userDoc.usertype == 'teacher' || userDoc.usertype == 'secretary';
}

var removeInvalidChars = lib.RemoveInvalidChars;

var validators = {
  ValidateSubjects: function (array) {
    if (!array) return false;
    for (var i = 0; i < array.length; i++) {
      if (!subjects[array[i]]) return false;
    }
    return true;
  },
  ValidateGroup: function (args, callback) {
    db.collection("groups").findOne({
      [foreignIdentifier]: teacherRep(args.userDoc),
      id: args.value
    }, {
      _id: 1
    }, function (err, result) {
      if (err) callback(false);
      if (result) callback(true);
      else return callback(false);
    });
  },
  ValidateUser: function (targetuser, filter, callback) {
    filter = defParam(filter, {
      _id: 1
    });
    db.collection("users").findOne({
      [identifier]: targetuser
    }, filter, function (err, result) {
      if (err) return callback(false);
      else if (result) callback(result);
      else callback(false);
    });
  },
  ValidateGrade: function (grade) {
    return (values(grades).indexOf(grade) > -1);
  },
  ValidateBidType: function (bidtype) {
    return (values(bidTypes).indexOf(bidtype) > -1);
  },
  ValidateToken: function (token, callback, getdata) {
    if (!token && arguments.callee.ignore) return true;
    getdata = getdata || arguments.callee.getdata || {
      userDoc: 1
    };
    try {
      var query = [{
        $match: {
          "token": token
        }
      }];
      var getdata_adds = [{
          $lookup: {
            from: "users",
            localField: foreignIdentifier,
            foreignField: identifier,
            as: "userDoc"
          }
        },
        {
          $unwind: "$userDoc"
        },
        {
          $project: lib.OverlayArray({
            id: 1
          }, getdata)
        }
      ];
      db.collection("tokens").aggregate(getdata ? query.concat(getdata_adds) : query, function (err, results) {
        if (err) callback(false);
        if (results && results.length > 0) callback(results[0].userDoc);
        else callback(false);
      });
    } catch (e) {
      callback(false);
      return;
    }
  },
  ValidateByIds: function (args, callback) {
    var ids = args.value;
    if (lib.validators.ValidateNumberArray(ids)) {
      if (ids.length == 0) {
        if (args.notbeEmpty) return callback(false);
        else return callback(true);
      }
      var col = args.col;
      var exp = {};
      exp[args.key] = {
        $in: ids
      };
      if (args.query) exp = lib.OverlayArray(exp, args.query);
      if (args.userDoc) exp[identifier] = teacherRep(args.userDoc);
      //!TODO make all conditions set to distinct after testing
      if (args.distinct) {
        db.collection(col).distinct(args.key, exp, function (err, result) {
          if (err) callback(false);
          else {
            if (result) {
              // just an option here
              if (args.oneConfirms) callback(true);
              else if (result.length == ids.length) callback(true);
              else callback(lib.ArraysDifference(result, args.value).added);
            } else callback(false);
          }
        });
      } else {
        db.collection(col).find(exp, {}).toArray((err, result) => {
          if (err) callback(false);
          else {
            if (result) {
              // because values can be in one document and distributed e.g. "'doc.value': [0,1]"
              if (args.oneConfirms) callback(true);
              else if (result.length == ids.length) callback(true);
              else callback(false);
            } else callback(false);
          }
        });
      }
    } else callback(false);
  },
  ValidateById: function (args, callback) {
    var id = args.value;
    db.collection(args.col).findOne({
      [args.key]: id,
      [identifier]: teacherRep(args.userDoc)
    }, {
      [args.key]: 1
    }, function (err, result) {
      if (err) callback(false);
      if (result) callback(true);
      else callback(false);
    })
  }
}

var fields = {
  modifiedCount: 'modifiedCount',
  deletedCount: 'deletedCount',
  insertedCount: 'insertedCount',
  matchedCount: 'matchedCount'
}

function ErrorAndCount(callback, err, result, field, fail, success) {
  if (err) return callback(err);
  if (result[field] > 0) {
    if (typeof success != 'undefined') callback(null, stats.OK, success);
    else callback(null, stats.OK);
  } else callback(null, fail);
}

function createToken(username, model, device) {
  var d = date();
  return {
    token: hash(JSON.stringify({
      unique: d,
      username: username,
      randomshit: lib.GenerateNumber(32)
    })),
    device: {
      device: device,
      model: model
    },
    unique: d
  }
}

function deleteByIds(args, callback) {
  col = arguments.callee.col;
  db.collection(col).remove({
    [foreignIdentifier]: teacherRep(args.userDoc) || student(args.userDoc),
    "id": {
      $in: args.ids
    }
  }, function (err) {
    if (err) return callback(err);
    else callback(null, stats.OK);
  });
}

function getReferenced(args, callback) {
  col = arguments.callee.col;
  if (args.ig_ids) {
    db.collection(col).find({
      id: {
        $in: args.ig_ids
      }
    }, {
      _id: 0,
      [foreignIdentifier]: 0
    }).toArray(function (err, result) {
      if (err) return callback(err);
      else callback(null, stats.OK, result)
    })
  } else {
    mongoh.GetDocuments(db, col, {
      [foreignIdentifier]: teacherRep(args.userDoc) || student(args.userDoc)
    }, {
      _id: 0,
      [foreignIdentifier]: 0
    }, args.startid, args.limit, function (result) {
      callback(null, stats.OK, result)
    });
  }
}

function _pass(args, callback) {
  callback(null, stats.PassedFunction);
}

function _isAlive(args, callback) {
  callback(null, stats.OK, {
    [identifier]: id(args.userDoc),
    username: args.userDoc.username,
    usertype: args.userDoc.usertype
  });
}

function registerTeacher(args, callback) {
  //if (!isAdmin(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.Exists(db, "users", {
    username: args.username
  }, function (result) {
    if (result) {
      callback(null, stats.Exists);
    } else {
      var password = '123456789';
      /*genPass.generate({
                      length: 8,
                      numbers: true
                  });*/
      mongoh.GetNextSequence(db, 'users', {}, identifier, lib.IntIncrementer, function (newid) {
        db.collection("users").insertOne({
          [identifier]: newid,
          [teacherForeignIdentifier]: newid,
          username: args.username,
          displayname: args.name,
          password: hash(password),
          usertype: 'teacher',
          defaults: {},
          grades: [],
          subjects: args.subjects,
          defaultStartDates: []
          /*creator: args.userDoc[identifier]*/
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, password);
        });
      });
    }
  });
}

// REG NEW_CODE

function hash(data, hash) {
  var salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(data, salt);
}

function check(chiper, hash) {
  return bcrypt.compareSync(chiper, hash);
}

//TODO stop after trying more than 10 times and monitor ips
function authorize(args, callback) {
  db.collection("users").findOne({
      $or: [{
          username: args.login
        },
        {
          email: args.login
        },
      ]
    }, {
      [identifier]: 1,
      password: 1
    },
    function (err, result) {
      if (err) return callback(err);
      if (result) {
        if (check(args.password, result.password)) {
          var token = createToken(result.username, args.model, args.device);
          mongoh.GetNextSequence(db, 'tokens', {}, 'id', lib.IntIncrementer, function (newid) {
            db.collection("tokens").insertOne({
              id: newid,
              userid: result[identifier],
              token: token.token,
              /*device: token.device.device,
              model: token.device.model, */
              date: new Date()
            }, function (err, result) {
              ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, token.token);
            });
          });
        } else callback(null, stats.WrongPassword);
      } else callback(null, stats.UserNonExisting);
    });
}

//TODO stop after trying more than 10 times in 30 minutes and monitor ips
function changePassword(args, callback) {
  if (check(args.oldpassword, args.userDoc.password)) {
    db.collection("users").updateOne({
      username: args.userDoc.username
    }, {
      $set: {
        password: hash(args.password)
      }
    }, function (err, result) {
      ErrorAndCount(callback, err, result, fields.modifiedCount, stats.Error);
    });
  } else callback(null, stats.WrongPassword);
}

// REG SECRETARIES_MANAGEMENT
//TODO create secretary user and manage them !!!
function createSecretary(args, callback) {
  if (!isTeacher(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.Exists(db, "users", {
    username: args.username
  }, function (result) {
    if (result) {
      callback(null, stats.Exists);
    } else {
      var password = genPass.generate({
        length: 8,
        numbers: true
      });
      mongoh.GetNextSequence(db, 'users', {}, identifier, lib.IntIncrementer, function (newid) {
        db.collection("users").insertOne({
          [identifier]: newid,
          username: args.username,
          displayname: args.name,
          [foreignIdentifier]: teacher(args.userDoc),
          password: hash(password),
          usertype: 'secretary'
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, password);
        });
      });
    }
  });
}

function listSecretaries(args, callback) {
  if (!isTeacher(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("users").find({
    [foreignIdentifier]: teacher(args.userDoc),
    usertype: 'secretary'
  }, {
    [identifier]: 1,
    "displayname": 1
  }).toArray(function (err, arr) {
    if (err) return callback(err);
    callback(null, stats.OK, arr);
  });
}

function removeSecretary(args, callback) {
  if (!isTeacher(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("users").updateOne({
    [identifier]: args[identifier],
    teacher: teacher(userDoc),
    usertype: 'secretary'
  }, {
    $set: {
      "disabled": true
    }
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.modifiedCount, stats.NonExisting);
  });
}

// EREG USER_MANAGEMENT

// EREG NEW_CODE

function validatePhoneCode(code) {
  return phonecodes[code] ? true : false;
}
// targetuser is temporary
function setPhone(args, callback) {
  mongoh.Exists(db, "phones", {
    "type": args.phonetype,
    [foreignIdentifier]: args.targetuser ? parseInt(args.targetuser) : 0
  }, function (result) {
    if (result) {
      db.collection("phones").updateOne({
        [identifier]: result[identifier],
      }, {
        $set: args.delete ? {
          phonecode: null,
          number: null
        } : {
          phonecode: args.phonecode,
          number: args.number
        }
      }, (err, result) => {
        ErrorAndCount(callback, err, result, fields.modifiedCount, stats.OK);
      });
    } else {
      mongoh.GetNextSequence(db, "phones", {}, "id", lib.IntIncrementer, function (newid) {
        db.collection("phones").insertOne({
          id: newid,
          [foreignIdentifier]: args.targetuser || teacherRep(args.userDoc),
          phonecode: args.phonecode,
          type: args.phonetype,
          number: args.number
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.OK);
        });
      });
    }
  });
}

function editPhone(args, callback) {
  mongoh.Exists(db, "phones", {
    id: args.id,
    [foreignIdentifier]: args.targetuser /* TEMPORARY */ || teacherRep(args.userDoc)
  }, function (result) {
    if (result) {
      var edits = {};
      if (!args.new_number && !args.new_phonecode && !args.new_phonetype) {
        callback(null, stats.OK);
        return
      }
      if (args.new_phonetype) edits.type = args.new_phonetype;
      if (args.new_phonecode) edits.phonecode = args.new_phonecode;
      if (args.new_number) edits.number = args.new_number;
      db.collection("phones").updateOne({
        _id: result._id
      }, {
        $set: edits
      }, function (err, result) {
        ErrorAndCount(callback, err, result, fields.matchedCount, stats.NonExisting);
      });
    } else callback(null, stats.NonExisting)
  });
}

function getPhones(args, callback) {
  db.collection("phones").find({
    userid: args.targetuser
  }).toArray((err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, stats.OK, result);
  });
}

function removePhones(args, callback) {
  var removephones = deleteByIds.clone();
  /* TEMPORARY */
  if (args.targetuser) args.userDoc[identifier] = args.targetuser;
  removephones.col = "phones";
  removephones(args, callback);
}

function addAddress(args, callback) {
  // prevent students from using center as an addresstype
  if (args.addresstype == "center" && isStudent(args.userDoc)) return callback(null, stats.InvalidData, "addresstype")
  mongoh.Exists(db, "addresses", {
    $or: [{
        "name": args.name
      },
      {
        "coordinates": args.coordinates
      }
    ]
  }, function (result) {
    if (result) {
      if (result[foreignIdentifier] == teacherRep(args.userDoc)) callback(null, stats.Exists);
      else callback(null, stats.Used, [result.name == args.name, result.coordinates == args.coordinates]);
    } else {
      try {
        mongoh.GetNextSequence(db, "addresses", {}, "id", lib.IntIncrementer, function (result) {
          var insert = () => {
            var data = {
              id: result,
              [foreignIdentifier]: teacherRep(args.userDoc),
              name: args.name,
              addresstype: args.addresstype,
              coordinates: args.coordinates,
            };
            if (args.phones != undefined) data.phones = args.phones;
            if (args.address != undefined) data.address = args.address;
            db.collection("addresses").insertOne(data, function (err, result) {
              ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error);
            });
          }
          if (args.address) {
            insert();
          } else {
            lib.ConvertCoordinatesAddress(args.coordinates, "ar", true, function (address) {
              args.address = address;
              insert();
            });
          }
        });
      } catch (e) {
        callback(e, stats.Error);
      }
    }
  });
}

function getAddresses(args, callback) {
  var getaddresses = getReferenced.clone();
  getaddresses.col = "addresses";
  getaddresses(args, callback);
}

function removeAddresses(args, callback) {
  var removeaddresses = deleteByIds.clone();
  removeaddresses.col = "addresses";
  removeaddresses(args, callback);
}

//TODO
function getFileServerId() {
  return 1;
}

function getFilePath(svr_id, id, extension) {
  return __dirname + '/' + "files/server" + lib.NumberToString(svr_id, 3) + "/" + id + '.' + extension;
}

function prepareUpload(args, callback) {
  var files = db.collection("files");
  files.findOne({
    checksum: args.checksum,
    linked: null
  }, {
    id: 1,
    completed: 1
  }, function (err, result) {
    if (err) return callback(err);
    mongoh.GetNextSequence(db, "files", {
      [foreignIdentifier]: teacherRep(args.userDoc)
    }, 'id', lib.IntIncrementer, function (id) {
      if (result && result.completed) {
        files.insertOne({
          id: id,
          [foreignIdentifier]: teacherRep(args.userDoc),
          permissions: args.permissions,
          linked: true,
          linkid: result.id,
          completed: true
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, id);
        });
      } else {
        files.insertOne({
          id: id,
          [foreignIdentifier]: teacherRep(args.userDoc),
          checksum: args.checksum,
          server: getFileServerId(),
          size: args.size,
          permissions: args.permissions,
          filetype: args.filetype,
          extension: args.extension
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, id);
        });
      }
    });
  })
}

function continueUpload(args, callback) {
  var files = db.collection("files");
  files.findOne({
    id: args.id
  }, {}, function (err, doc) {
    var path;
    if (doc) path = getFilePath(doc.server, args.id, doc.extension);
    if (err) return callback(err);
    else if (!doc) callback(null, stats.FileNotFound);
    else if (doc.size != args.size) callback(null, stats.SizesDontMatch);
    else if (doc[foreignIdentifier] != teacherRep(args.userDoc)) callback(null, stats.NotPermitted);
    else if (doc.completed == true) callback(null, stats.AlreadyUploaded);
    else if (doc.checksum != args.checksum) callback(null, stats.ChecksumsDontMatch);
    else callback(null, stats.OK, lib.FileSize(path));
  });
}

function upload(args, callback, buffer) {
  var files = db.collection("files");
  files.findOne({
    id: args.id
  }, {}, function (err, doc) {
    var path;
    if (doc) path = getFilePath(doc.server, args.id, doc.extension);
    if (err) return callback(err);
    else if (!doc) callback(null, stats.FileNotFound);
    else if (doc.size != args.size) callback(null, stats.SizesDontMatch);
    else if (doc[foreignIdentifier] != teacherRep(args.userDoc)) callback(null, stats.NotPermitted);
    else if (doc.completed == true) callback(null, stats.AlreadyUploaded);
    else if (doc.checksum != args.checksum) callback(null, stats.ChecksumsDontMatch);
    else {
      var range = args.bytes_range;
      var size = lib.FileSize(path);
      if (size == range.start && (range.end - range.start) == buffer.length) {
        try {
          if (fs.existsSync(path)) fs.appendFileSync(path, buffer);
          else fs.writeFileSync(path, buffer);
        } catch (e) {
          return callback(e, stats.Error);
        }
        size = lib.FileSize(path);
        if (size == range.end) {
          if (range.end == doc.size) {
            if (md5.sync(path) == args.checksum) {
              files.updateOne({
                id: args.id
              }, {
                $set: {
                  completed: true
                }
              }, function (err, result) {
                if (err) return callback(err);
                else if (result.modifiedCount == 1) {
                  switch (doc.filetype) {
                    case filetypes.images:
                      ip.isValid(path, function (result) {
                        if (result) {
                          callback(null, stats.UploadCompleted);
                        } else {
                          callback(null, stats.UploadFailed);
                          cleanUpUpload(doc);
                        }
                      });
                      break;
                    default:
                      callback(null, stats.UploadCompleted);
                      break;
                  }
                } else callback(null, stats.FileNotFound);
              });
            } else callback(null, stats.UploadFailed);
          } else {
            callback(null, stats.Continue, range.end.toString());
          }
        } else {
          callback(null, stats.UploadFailed);
          cleanUpUpload(doc);
        }
      } else callback(null, stats.RangesDontMatch, size);
    };
  });
}
// not linked to outer shit
function cleanUpUpload(doc, callback) {
  if (!callback) callback = function () {};
  var files = db.collection("files");
  files.findOne({
    linkid: doc.id,
    linked: true
  }, {
    _id: 1
  }, function (err, result) {
    if (err) return callback(false);
    else if (result) {
      files.updateOne({
        id: doc.id
      }, {
        $set: {
          disabled: true
        }
      }, function (err, result) {
        if (err) return callback(false);
        else if (result.matchedCount == 1) callback(true);
        else callback(true);
      })
    } else {
      var path = getFilePath(doc.server, doc.id, doc.extension);
      files.deleteOne({
        id: doc.id
      }, function (err, result) {
        if (err) return callback(false);
        else if (result.deletedCount == 1) {
          try {
            fs.unlinkSync(path);
          } finally {
            callback(true);
          }
        } else callback(false);
      });
    }
  });
}

function deleteFiles(args, callback) {
  var files = db.collection("files");
  files.find({
    id: {
      $in: args.ids
    }
  }, {}).toArray(function (err, docs) {
    if (err) return callback(err);
    if (docs) {
      var id = 0;
      var length = docs.length;
      var failed = [];

      function loop() {
        if (id >= length) {
          return callback(null, stats.OK, failed);
        }
        if (docs[id][foreignIdentifier] != teacherRep(args.userDoc)) {
          failed.push(docs[id].id);
          id++;
          loop();
          return;
        }
        if (docs[id].linked) {
          files.deleteOne({
            id: docs[id].id
          }, function (err, result) {
            if (err) failed.push(docs[id].id);
            else if (result.deletedCount != 1) failed.push(docs[id].id);
            id++;
            loop();
          })
        } else {
          cleanUpUpload(docs[id], function (result) {
            if (!result) failed.push(docs[id].id);
            id++;
            loop();
          });
        }
      }
      loop();
    } else callback(null, stats.FilesNotFound);
  });
}

function download(args, callback) {
  var files = db.collection("files");
  files.findOne({
    id: args.id
  }, {}, function (err, doc) {
    if (err) return callback(err);
    if (doc) {
      if (checkPermissions(doc, args.userDoc)) {
        var path = getFilePath(doc.server, args.id, doc.extension);
        var stream = fs.createReadStream(path, {
          start: args.abs_bytes_range.start,
          end: args.abs_bytes_range.end
        });
        stream.on("open", function () {
          callback(null, stats.OK, undefined, stream);
        }).on("error", function (err) {
          callback(err);
        });
      } else callback(null, stats.NotPermitted);
    } else callback(null, stats.FileNotFound);
  });
}

function checkPermissions(doc, userDoc) {
  switch (true) {
    case doc[foreignIdentifier] == userDoc[identifier] || doc[foreignIdentifier] == teacherRep(args.userDoc):
    case doc.public:
      return true;
      break;
    default:
      return false;
  }
}

function getFilesInfo(args, callback) {
  var files = db.collection("files");
  files.find({
    id: {
      $in: args.ids
    }
  }, {
    _id: 0
  }).toArray(function (err, docs) {
    if (err) return callback(err);
    if (docs) {
      for (var i = 0; i < docs.length; i++) {
        var path = getFilePath(docs[i].server, docs[i].id, docs[i].extension);
        //TODO not sure about checksumming the files !!
        if (!checkPermissions(docs[i], args.userDoc)) return callback(null, stats.NotPermitted, docs[i].id);
        if (!docs[i].completed) return callback(null, stats.Incomplete, docs[i].id);
        if (!fs.existsSync(path)) return callback(null, stats.FileNotFound, docs[i].id);
        delete docs[i].completed;
        delete docs[i].server;
        delete docs[i].permissions;
      }
      // missing docs will be calculated on the user side
      callback(null, stats.OK, docs);
    } else callback(null, stats.FilesNotFound);
  });
}

function sendNotification(userid, type, data, callback) {
  db.collection("notifications").insertOne({
    userid: userid,
    type: type,
    data: data
  }, function (err, result) {
    if (err) callback(false);
    if (result.insertedCount > 0) callback(true);
    else callback(false);
  });
}

function SearchStudents(args, callback) {
  var query = {
    $text: {
      $search: args.name
    },
  };
  if (args.ig_grades) query.grade = {
    '$in': args.ig_grades
  };
  var a = db.collection("links").find(query, {
    _id: 0,
  });
  a.count((err, count) => {
    if (err) return callback(err);
    a.skip(args.startid).limit(args.limit).sort({
      fullname: -1
    }).toArray(function (err, arr) {
      if (err) return callback(err);
      var returner = {};
      returner.result = [];
      returner.count = count;
      // inverse here cause text indexes cannot be inversed... or at least based on what I know :'D
      for (var i = 4; i > -1; i--) {
        if (arr.hasOwnProperty(i)) {
          returner.result.push({
            username: arr[i].username,
            grade: arr[i].grade,
            [identifier]: arr[i][identifier],
            [studentForeignIdentifier]: arr[i][studentForeignIdentifier],
            fullname: arr[i].fullname,
          });
        }
      }
      callback(null, stats.OK, returner);
    });
  });
}

// REG TEACHERS

//TODO duplicates
function bid(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.GetNextSequence(db, "bids", {
    [foreignIdentifier]: teacherRep(args.userDoc)
  }, "id", lib.IntIncrementer, function (result) {
    db.collection("bids").insertOne({
      id: result,
      [foreignIdentifier]: teacherRep(args.userDoc),
      title: args.title,
      grade: args.grade,
      bidtype: args.bidtype,
      open: true,
      gender: args.gender,
      addresses: args.addresses,
      subjects: args.subjects,
      timetables: args.timetables,
      prices: args.prices
    }, function (err, result) {
      ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error);
    })
  });
}
//TODO available in ids and current user version
//TODO make filters for tts (available,fitting to timetable)
function getBids(args, callback) {
  if (isTeacher(args.userDoc) && !args.targetuser) args.targetuser = teacherRep(args.userDoc);
  var ids = db.collection("bids").distinct("id", {
    [foreignIdentifier]: args.targetuser
  }, function (err, ids) {
    if (err) return callback(err);
    else callback(null, stats.OK, ids);
  });
}
//TODO arrays
/*function checkTimetableCollision(args, callback, api) {
    var checkgrade = false;
    if (args.userDoc.usertype == "student" && !api) {
        if (!args.userDoc.grade) {
            callback(null, stats.UnspecifiedGrade);
            return;
        }
        checkgrade = true
    };
    if (!args.ttcoll_ids) args.ttcoll_ids = [];
    if (!args.ttcoll_usernames) args.ttcoll_usernames = [];
    var end = args.start_time + args.period;
    var start_time_query = {
        "timetables.timetable": {
            "$elemMatch": {
                "start": {
                    $lte: args.start_time
                },
                "end": {
                    $gte: args.start_time
                }
            }
        }
    };
    var end_query = {
        "timetables.timetable": {
            "$elemMatch": {
                "start": {
                    $lte: end
                },
                "end": {
                    $gte: end
                }
            }
        }
    }
    if (args.days) {
        start_time_query['timetables.timetable']['$elemMatch'].day = {
            $in: args.days
        };
        end_query['timetables.timetable']['$elemMatch'].day = {
            $in: args.days
        };
    }
    var query = {
        $and: [{
            $or: [start_time_query, end_query]
        }]
    };
    if (args.ttcoll_usernames.length > 0) query['$and'].push({
        "username": {
            $in: args.ttcoll_usernames
        }
    });
    if (args.ttcoll_ids.length > 0) query['$and'].push({
        "id": {
            $in: args.ttcoll_ids
        }
    });
    if (checkgrade) query.grade = args.userDoc.grade;
    db.collection("bids").find(query, {
        _id: 0,
        id: 1
    }).toArray(function(err, result) {
        if (err) return callback(err);
        else callback(null, stats.OK, result);
    });
}*/

function getBio(args, callback) {
  if (isTeacher(args.userDoc) && !args.targetuser) return callback(null, stats.OK, args.userDoc.bio);
  var ids = db.collection("users").findOne({
    [identifier]: args.targetuser
  }, {
    bio: 1
  }, function (err, result) {
    if (err) return callback(err);
    else callback(null, stats.OK, result.bio);
  });
}

function editBio(args, callback) {
  if (!isTeacher(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("users").updateOne({
    [identifier]: teacher(args.userDoc)
  }, {
    $set: {
      "bio": args.bio
    }
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.UserNonExisting);
  });
}

function getGrades(args, callback) {
  if (isTeacher(args.userDoc) && !args.targetuser) return callback(null, stats.OK, args.userDoc.grades.sort());
  var ids = db.collection("users").findOne({
    [identifier]: args.targetuser
  }, {
    grades: 1,
  }, function (err, result) {
    if (err) return callback(err);
    else callback(null, stats.OK, result.grades.sort());
  });
}

/*function editGrades(args, callback) {
    if (args.userDoc.usertype == "student") {
        return callback(null, stats.IncapableUserType);
    }
    db.collection("users").updateOne({
        "username": args.userDoc.username
    }, {
        $set: {
            "grades": args.grades
        }
    }, function(err, result) {
        ErrorAndCount(callback, err, result, fields.matchedCount, stats.UserNonExisting);
    });
}

function getSubjects(args, callback) {
    if (args.userDoc.usertype == "teacher") {
        callback(null, stats.OK, args.userDoc.subjects);
    } else if (args.userDoc.usertype == "student") {
        validators.ValidateUser(targetuser, {
            subjects: 1
        }, function(result) {
            if (result) callback(null, stats.OK, result.subjects);
            else callback(null, stats.UserNonExisting);
        });
    }
}

function addSubjects(args, callback) {
    if (args.userDoc.usertype == "student") {
        callback(null, stats.IncapableUserType);
        return;
    }
    var subs = args.userDoc.subjects;
    var colls = lib.ArraysCollision(subs, args.subjects);
    if (lib.ArraysCollision(subs, args.subjects)) {
        callback(null, stats.Exists, colls);
    } else {
        var n = subs.concat(args.subjects);
        db.collection("users").updateOne({
            "username": args.userDoc.username
        }, {
            $set: {
                "subjects": n
            }
        }, function(err, result) {
            ErrorAndCount(callback, err, result, fields.matchedCount, stats.UserNonExisting);
        });
    }
}

function removeSubjects(args, callback) {
    if (args.userDoc.usertype == "student") {
        callback(null, stats.IncapableUserType);
        return;
    }
    db.collection("users").updateOne({
        "username": args.userDoc.username
    }, {
        $pull: {
            "subjects": {
                $in: args.subjects
            }
        }
    }, function(err, result) {
        ErrorAndCount(callback, err, result, fields.matchedCount, stats.NothingHappened);
    });
}*/

/**
 * Create a global grade
 * 
 * @typedef {Object} CreateGradePayload
 * @property {string} name
 * 
 * @param  {CreateGradePayload} args
 * @param  {Function} callback
 */
function createGrade(args, callback) {
  mongoh.GetNextSequence(db, 'grades', {}, 'id', lib.IntIncrementer, (newid) => {
    db.collection('grades')
      .insertOne({
        id: newid,
        name: args.name,
      }, (error, result) => {
        ErrorAndCount(callback, error, result, fields.insertedCount, stats.Error);
      });
  });
}
/**
 * List global grades
 * 
 * @param  {Object} args
 * @param  {Function} callback
 */
function listGrades(args, callback) {
  db.collection('grades').find({
    deleted: {
      $ne: true
    }
  }).toArray((error, result) => {
    if (error) {
      return callback(error, stats.Error);
    }
    callback(error, stats.OK, result);
  });
}

/**
 * Update a global grade
 * 
 * @typedef {Object} UpdateGradePayload
 * @property {number} id
 * @property {string} name
 * 
 * @param  {UpdateGradePayload} args
 * @param  {Function} callback
 */
function updateGrade(args, callback) {
  const {
    id,
    name
  } = args;

  db.collection('grades')
    .updateOne({
      id
    }, {
      $set: {
        name
      }
    }, (error, result) => {
      ErrorAndCount(callback, error, result, fields.matchedCount, stats.NonExisting);
    })
}

/**
 * Delete a global grade
 * 
 * @typedef {Object} DeleteGradePayload
 * @property {number} id
 * 
 * @param  {DeleteGradePayload} args
 * @param  {Function} callback
 */
function deleteGrade(args, callback) {
  // if a user deleted the last grade
  // next id will be that of the last
  // it will cause a lot of problems
  db.collection('grades')
    .updateOne({
      id: args.id
    }, {
      $set: {
        deleted: true
      }
    }, (error, result) => {
      ErrorAndCount(callback, error, result, fields.deletedCount, stats.NonExisting);
    });
}

function updateTeacherGradesAndSubjects(userid, callback) {
  db.collection("groups").aggregate([{
      $match: {
        [foreignIdentifier]: userid
      }
    },
    {
      $group: {
        _id: null,
        grades: {
          $addToSet: "$grade"
        }
      }
    },
    {
      $project: {
        _id: 0,
        grades: "$grades"
      }
    }
  ], function (err, result) {
    if (err) return;
    if (result[0]) var grades = result[0].grades;
    else var grades = [];
    db.collection("users").updateOne({
      [identifier]: userid
    }, {
      $set: {
        grades: result ? grades.sort((a, b) => {
          return b - a;
        }) : [],
        //defaultStartDates: result ? result.defaultStartDates : []
      }
    }, () => {
      if (callback) callback()
    })
  });
}

function cleanUpGroupLinks(groupid, callback) {
  db.collection("groupslinks").updateMany({
    'links.groupid': groupid
  }, {
    $pull: {
      links: {
        groupid: groupid
      }
    }
  }, () => {
    db.collection("groupslinks").deleteMany({
      links: {
        $size: 0
      }
    }, () => {});
  })
  db.collection("links").updateMany({
    group: groupid
  }, {
    $set: {
      group: null
    }
  }, function (err, result) {
    if (err) callback(false);
    else callback(true);
  });
}

/*"subjects" : [
        12,
        13
    ],
    "address" : 0,
    "gender" : "maledominant",
    "timetable" : [
        {
            "start" : 930,
            "end" : 990,
            "day" : 1
        },
        {
            "start" : 930,
            "end" : 990,
            "day" : 3
        },
        {
            "start" : 930,
            "end" : 990,
            "day" : 5
        }
    ]*/
function createGroup(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.GetNextSequence(db, "groups", {}, "id", lib.IntIncrementer, function (newid) {
    if (typeof newid != 'number') return callback(null, stats.Error);
    db.collection("groups").insertOne({
      id: newid,
      [foreignIdentifier]: teacherRep(args.userDoc),
      name: args.name,
      grade: args.grade,
      /*subjects: args.subjects,
      address: args.addressid,
      gender: args.gender || "mixed",
      */
      schedule: args.schedule
    }, function (err, result) {
      if (err) callback(err);
      else {
        if (result.insertedCount > 0) {
          updateTeacherGradesAndSubjects(teacherRep(args.userDoc), () => {
            callback(null, stats.OK, newid);
          });
        } else callback(null, stats.Error);
      }
    });
  });
}

function removeGroup(args, callback) {
  db.collection("groups").findOne({
    id: args.groupid
  }, function (err, result) {
    if (err) callback(err);
    if (result) {
      cleanUpGroupLinks(args.groupid, (done) => {
        if (done) {
          db.collection("groups").deleteOne({
            id: args.groupid,
            [foreignIdentifier]: teacherRep(args.userDoc)
          }, function (err, result) {
            updateTeacherGradesAndSubjects(teacherRep(args.userDoc), () => {
              ErrorAndCount(callback, err, result, fields.deletedCount, stats.NonExisting);
            });
          });
        } else callback(null, stats.Error);
      });
    } else callback(null, stats.NonExisting)
  })
}

// grade, classnum, groupid, day
function linkGroupClasses(args, callback) {
  if (args.classnum == -1) {
    db.collection("groupslinks").updateMany({
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }, {
      $pull: {
        links: {
          day: args.groupday,
          groupid: args.groupid
        }
      }
    }, {}, (err) => {
      if (err) callback(err);
      else callback(null, stats.OK);
      db.collection("groupslinks").deleteMany({
        links: {
          $size: 0
        }
      }, () => {});
    })
  } else {
    db.collection("groupslinks").updateMany({
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }, {
      $pull: {
        links: {
          day: args.groupday,
          groupid: args.groupid
        }
      }
    }, {}, () => {
      db.collection("groupslinks").updateOne({
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        grade: args.grade,
        classnum: args.classnum
      }, {
        $push: {
          links: {
            day: args.groupday,
            groupid: args.groupid
          }
        }
      }, {
        upsert: true
      }, (err) => {
        if (err) callback(err);
        else callback(null, stats.OK);
      });
    })
  }

}

function listGroupClassesLinks(args, callback) {
  db.collection('groups').aggregate([{
      $match: {
        [foreignIdentifier]: teacherRep(args.userDoc),
        grade: args.grade
      }
    },
    {
      $unwind: "$schedule.days"
    },
    {
      $group: {
        _id: "$id",
        len: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        len: -1
      }
    },
    {
      $limit: 1
    }
  ], (err, result) => {
    if (err) callback(err);
    db.collection("groupslinks").find({
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }, {
      _id: 0,
      [teacherForeignIdentifier]: 0
    }).toArray((err, links) => {
      if (err) callback(err);
      else callback(null, stats.OK, {
        classescount: result[0] ? result[0].len : 0,
        links: links
      });
    });
  })
}

function distinctGroups(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("groups").find({
    [foreignIdentifier]: teacherRep(args.userDoc),
    grade: {
      $in: args.ig_grades || args.userDoc.grades
    }
  }, {
    _id: 0,
    name: 1,
    id: 1
  }).toArray(function (err, results) {
    if (err) callback(err);
    callback(null, stats.OK, results);
  });
}

function getGroup(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("groups").findOne({
    [foreignIdentifier]: teacherRep(args.userDoc),
    id: args.id
  }, {
    _id: 0,
    [foreignIdentifier]: 0
  }, (err, group) => {
    if (err) callback(err);
    else if (group) callback(null, stats.OK, group);
    else callback(null, stats.NonExisting);
  });
}

function listGradeMonths(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("classes").aggregate([{
      $match: {
        grade: args.grade
      }
    },
    {
      $group: {
        _id: {
          month: {
            $sum: [{
              $month: "$date"
            }, -1]

          },
          year: {
            $year: "$date"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year"
      }
    }
  ], (err, result) => {
    if (err) callback(err);
    callback(null, stats.OK, result);
  });
}

function listGroups(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("groups").find({
    [foreignIdentifier]: teacherRep(args.userDoc),
    grade: {
      $in: args.ig_grades || args.userDoc.grades
    }
  }, {
    _id: 0,
    [foreignIdentifier]: 0
  }).toArray(function (err, results) {
    if (err) callback(err);
    callback(null, stats.OK, results);
  });
}

function editGroup(args, callback) {
  let updateQuery = {};
  if (args.ig_name) updateQuery.name = args.ig_name;
  if (args.ig_schedule) updateQuery.schedule = args.ig_schedule;
  if (updateQuery.schedule.days) {
    db.collection("groups").findOne({
      id: args.id,
      [foreignIdentifier]: teacherRep(args.userDoc)
    }, {
      'schedule.days': 1,
      grade: 1
    }, (err, group) => {
      if (err) callback(err);
      else update(() => {
        var diff = lib.ArraysDifference(group.schedule.days, updateQuery.schedule.days);
        if (diff.changed && diff.removed.length > 0) {
          db.collection('groupslinks').updateMany({
            [teacherForeignIdentifier]: teacherRep(args.userDoc),
            grade: group.grade
          }, {
            $pull: {
              links: {
                groupid: args.id,
                day: {
                  $in: diff.removed
                }
              }
            }
          }, () => {
            db.collection("groupslinks").deleteMany({
              links: {
                $size: 0
              }
            }, () => {});
          });
        }
      });
    });
  } else update();
  var update = (local_callback) => {
    db.collection("groups").updateOne({
      id: args.id,
      [foreignIdentifier]: teacherRep(args.userDoc)
    }, {
      $set: updateQuery
    }, (err) => {
      if (err) callback(err);
      else {
        callback(null, stats.OK);
        if (local_callback) local_callback();
      }
    });
  }
}

function removeGroupClass(args, callback) {
  db.collection('groupslinks').updateMany({
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    grade: args.grade
  }, {
    $pull: {
      links: {
        groupid: args.groupid,
        day: args.groupday
      }
    }
  }, (err) => {
    db.collection("groupslinks").deleteMany({
      links: {
        $size: 0
      }
    }, () => {});
    db.collection("groups").updateOne({
      id: args.groupid,
      [foreignIdentifier]: teacherRep(args.userDoc)
    }, {
      $pull: {
        'schedule.days': args.groupday
      }
    }, (err) => {
      if (err) callback(err);
      else {
        callback(null, stats.OK);
      }
    });
  });
}

function getStudent(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("links").aggregate([{
    $match: {
      [studentForeignIdentifier]: args.targetuser
    }
  }, {
    $lookup: {
      from: 'users',
      localField: 'studentid',
      foreignField: 'id',
      as: 'user_data'
    }
  }, {
    $lookup: {
      from: 'payments',
      localField: 'studentid',
      foreignField: 'studentid',
      as: 'payments'
    }
  }, {
    $lookup: {
      from: 'groups',
      localField: 'group',
      foreignField: 'id',
      as: 'groupinfo'
    }
  }, {
    $lookup: {
      from: 'phones',
      localField: studentForeignIdentifier,
      foreignField: foreignIdentifier,
      as: 'phones'
    }
  }, {
    $project: {
      [studentForeignIdentifier]: 1,
      id: 1, // link identifier
      fullname: 1,
      grade: 1,
      group: 1,
      notes: "$user_data.notes",
      discount: "$user_data.discount",
      code: "$user_data.code",
      'phones.number': 1,
      'phones.phonecode': 1,
      'phones.type': 1,
      'phones.id': 1,
      'groupinfo.name': 1,
      'payments.payed': 1,
      'payments.discount': 1,
      'payments.itemid': 1
    }
  }], function (err, result) {
    if (err) return callback(err);
    else try {
      result = result[0];
      if (result) {
        db.collection("items").find({
          [teacherForeignIdentifier]: teacherRep(args.userDoc),
          grade: result.grade
        }, {
          _id: 0
        }).toArray((err, items) => {
          if (err) return callback(err);
          var paymentsIds = {};
          for (var i = 0; i < result.payments.length; i++) {
            paymentsIds[result.payments[i].itemid] = i
          }
          for (var i = 0; i < items.length; i++) {
            var payId = paymentsIds[items[i].id];
            if (typeof payId == 'number' && !isNaN(payId) && result.payments[i]) {
              items[i].payed = result.payments[i].payed;
              items[i].discount = result.payments[i].discount;
            }
          }
          result.payments = items;
          result.code = result.code[0];
          result.discount = result.discount[0];
          result.notes = result.notes[0];
          callback(null, stats.OK, result);
        });
      } else callback(null, stats.UserNonExisting);
    } catch (e) {
      callback(null, stats.UserNonExisting);
    }
  });
}

function qrListStudents(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  };
  if (args.ig_groups) query.group = {
    $in: args.ig_groups
  };
  if (args.ig_grades) query.grade = {
    $in: args.ig_grades
  };
  db.collection("links").aggregate([{
      $match: query
    },
    {
      $lookup: {
        from: 'users',
        localField: studentForeignIdentifier,
        foreignField: identifier,
        as: 'user'
      }
    },
    {
      $project: {
        _id: 0,
        studentid: 1,
        fullname: 1,
        'user.code': 1
      }
    }
  ], function (err, result) {
    if (err) callback(err);
    callback(null, stats.OK, result);
  });
}

function listContacts(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);

  query = [{
    $lookup: {
      from: 'phones',
      localField: identifier,
      foreignField: foreignIdentifier,
      as: 'contacts'
    }
  }];

  db.collection("users").aggregate(query, (err, result) => {
    if (err) callback(err);
    callback(null, stats.OK, result);
  });
}

function listStudents(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var match_query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  };
  if (args.ig_groups) match_query.group = {
    $in: args.ig_groups
  };
  if (args.ig_grades) match_query.grade = {
    $in: args.ig_grades
  };

  let query = [{
    $match: match_query
  }, {
    $skip: args.startid
  }, {
    $limit: args.limit
  }, {
    $sort: {
      fullname: 1
    }
  }];

  if (args.ig_getcontacts) {
    query.push({
      $lookup: {
        from: 'phones',
        localField: studentForeignIdentifier,
        foreignField: foreignIdentifier,
        as: 'contacts'
      }
    });
  }

  db.collection("links").aggregate(query, (err, result) => {
    if (err) callback(err);
    callback(null, stats.OK, result);
  });
}

function countStudents(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  };
  if (args.ig_groups) query.group = {
    $in: args.ig_groups
  };
  if (args.ig_grades) query.grade = {
    $in: args.ig_grades
  };
  db.collection("links").count(query, function (err, result) {
    if (err) callback(err);
    callback(null, stats.OK, args.startid >= result ? 0 : (result - args.startid));
  });
}

function post(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.GetNextSequence(db, "posts", {}, "id", lib.IntIncrementer, function (result) {
    if (!args.media_ids) args.media_ids = [];
    db.collection("posts").insertOne({
      id: result,
      [foreignIdentifier]: teacherRep(args.userDoc),
      text: args.text,
      media_ids: args.media_ids
    }, function (err, result) {
      ErrorAndCount(callback, err, result, fields.matchedCount, stats.NothingHappened);
    })
  });
}
//TODO test
function editPost(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var posts = db.collection("posts");
  posts.findOne({
    id: args.id
  }, {}, function (err, doc) {
    if (err) return callback(err);
    if (!doc) return callback(null, stats.NonExisting);
    if (args.new_media_ids && !lib.validators.ValidateNumberArray(args.new_media_ids)) return callback(null, stats.InvalidData, "new_media_ids");
    var changes = lib.ArraysDifference(doc.media_ids, args.new_media_ids);
    if (!changes.changed && doc.text == args.text) return callback(null, stats.OK);
    var query = {
      $set: {}
    }
    if (doc.text != args.text) query.$set.text = args.text;

    function finish() {
      posts.updateOne({
        id: args.id
      }, query, function (err, result) {
        ErrorAndCount(callback, err, result, fields.matchedCount, stats.NonExisting);
      });
    }
    if (changes.changed) {
      if (changes.removed.length > 0) {
        deleteFiles({
          userDoc: args.userDoc,
          ids: changes.removed
        }, function () {});
      }
      validators.ValidateByIds({
        value: args.new_media_ids,
        col: "files",
        key: "id",
        query: {
          completed: true
        },
        userDoc: {
          [identifier]: teacherRep(args.userDoc)
        },
        distinct: true
      }, function (result) {
        if (result === true) {
          query.$set.media_ids = args.new_media_ids;
          finish();
        } else {
          // result: failed
          // rm.result: failed added, rm.removed: failed same
          var rm = lib.RemoveValuesFromArray(result, changes.same);
          if (rm.result.length > 0) return callback(null, stats.FilesNotFound, result);
          else if (rm.removed.length > 0) query.$set.media_ids = lib.RemoveValuesFromArray(args.new_media_ids, rm.removed).result;
          finish();
        }
      })
    } else finish();
  });
}

function removePost(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var posts = db.collection("posts")
  posts.findOne({
    id: args.id
  }, {}, function (err, doc) {
    if (err) callback(err);
    if (!doc) return callback(null, stats.NonExisting);
    else if (doc[foreignIdentifier] != teacherRep(args.userDoc)) callback(null, stats.NotPermitted);
    var finish = function () {
      posts.deleteOne({
        id: args.id
      }, function (err, result) {
        ErrorAndCount(callback, err, result, fields.deletedCount, stats.Error);
      });
    }
    if (doc.media_ids && doc.media_ids.length > 0) {
      deleteFiles({
        userDoc: args.userDoc,
        ids: doc.media_ids
      }, function (err, stat, result) {
        if (err) return callback(err);
        if (stat == stats.OK) {
          // don't care about partial failure
          if (result.length == doc.media_ids.length) return callback(null, stats.Error);
          finish();
        } else callback(null, stats.Error);
      });
    } else finish();
  });
}
//TODO get feed

function getSuperTTDefaults(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  else callback(null, stats.OK, {
    grades: args.userDoc.grades,
    defaults: args.userDoc.defaults
  });
}

function setSuperTTDefaults(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var inputs = [
    'days',
    'whours',
    'duration',
    'break'
  ];
  var query = {
    $set: {}
  };
  for (var key in inputs) {
    if (args[inputs[key]]) {
      query.$set["defaults." + inputs[key]] = args[inputs[key]];
    }
  }
  if (Object.keys(query.$set).length == 0) return callback(null, stats.EmptyData);
  db.collection("users").updateOne({
    [identifier]: teacherRep(args.userDoc)
  }, query, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.UserNonExisting);
  });
}

function getDefaultPhoneCode(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  else callback(null, stats.OK, args.userDoc.defaults.phonecode);
}

function setDefaultPhoneCode(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("users").updateOne({
    [identifier]: teacherRep(args.userDoc)
  }, {
    $set: {
      ['defaults.phonecode']: args.phonecode
    }
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.modifiedCount, stats.UserNonExisting);
  });
}

function renameStudent(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.Exists(db, "users", {
    [identifier]: args.targetuser
  }, function (result) {
    if (result) {
      db.collection("users").updateOne({
        [identifier]: args.targetuser
      }, {
        $set: {
          displayname: `${args.fullname.first} ${args.fullname.last}`,
          fullname: `${args.fullname.first} ${args.fullname.father} ${args.fullname.grand} ${args.fullname.last}`,
          firstname: args.fullname.first,
          fathername: args.fullname.father,
          grandname: args.fullname.grand,
          lastname: args.fullname.last,
        }
      }, function (err, result) {
        if (err) return callback(err);
        if (result.matchedCount > 0) {
          db.collection("links").updateMany({
            [studentForeignIdentifier]: args.targetuser
          }, {
            $set: {
              fullname: `${args.fullname.first} ${args.fullname.father} ${args.fullname.grand} ${args.fullname.last}`,
            }
          }, function (err, result) {
            if (err) callback(err);
            else callback(null, stats.OK);
            //TODO revert changes
          });
        } else callback(null, stats.NonExisting);
      });
    } else callback(null, stats.NonExisting);
  });
}

//TODO username stopped here
function registerStudent(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.Exists(db, "users", {
    firstname: args.fullname.first,
    fathername: args.fullname.father,
    grandname: args.fullname.grand,
    lastname: args.fullname.last
  }, function (result) {
    if (result) {
      callback(null, stats.Exists);
    } else {
      var password = genPass.generate({
        length: 6,
        numbers: true,
        uppercase: false
      });
      mongoh.GetNextSequence(db, 'users', {}, 'id', lib.IntIncrementer, function (newid) {
        db.collection("users").insertOne({
          id: newid,
          displayname: `${args.fullname.first} ${args.fullname.last}`,
          fullname: `${args.fullname.first} ${args.fullname.father} ${args.fullname.grand} ${args.fullname.last}`.trim(),
          firstname: args.fullname.first,
          fathername: args.fullname.father,
          grandname: args.fullname.grand,
          lastname: args.fullname.last,
          //username: /*args.username*/ ,
          //password: hash(password),
          code: password,
          refered: true,
          referer: teacherRep(args.userDoc),
          usertype: 'student'
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, {
            id: newid
          });
        });
      });
    }
  });
}
// linkid
function unlinkStudent(args, callback) {
  db.collection("links").deleteOne({
    id: args.linkid,
    teacherid: teacherRep(args.userDoc)
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.deletedCount, stats.NonExisting);
  })
}

function editLink(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var query = {};
  if (typeof args.grade == 'number') query.grade = args.grade;
  if (typeof args.group == 'number') query.group = args.group;
  db.collection("links").updateOne({
    id: args.id
  }, {
    $set: query
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.NonExisting);
  });
}

function linkStudent(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.Exists(db, 'links', {
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    [studentForeignIdentifier]: args.student,
    grade: args.grade,
  }, function (linkExists) {
    if (linkExists) return callback(null, stats.Exists);
    validators.ValidateUser(args.student, {
      refered: 1,
      fullname: 1,
      firstname: 1,
    }, (result) => {
      if (!result) return callback(null, stats.NonExisting);
      mongoh.GetNextSequence(db, "links", {}, 'id', lib.IntIncrementer, (newid) => {
        if (!typeof newid == 'number') return callback(null, stats.Error);
        db.collection("links").insertOne({
          id: newid,
          [teacherForeignIdentifier]: teacherRep(args.userDoc),
          [studentForeignIdentifier]: args.student,
          fullname: result.fullname,
          firstname: result.firstname,
          fathername: result.fathername,
          grandname: result.grandname,
          lastname: result.lastname,
          grade: args.grade,
          group: args.group,
        }, function (err, result) {
          ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error)
        });
      });
    });
  }, false);
}
/* times
[
{day: <ISODate>, start: 720, end: 900}
]
-------
grade: ValidateGrade, curriculum: ValidateString, notes: ValidateOrIgnoreString
*/
/*"times" : [
        {
            "day" : "2017-09-15",
            "start" : 720,
            "end" : 1060
        }
    ],
    "curriculum" : "test",
    "strict" : true,
    "notes" : "gewagreagae",*/
function addExam(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.GetNextSequence(db, 'exams', {}, 'id', lib.IntIncrementer, function (newid) {
    if (typeof newid != 'number') return callback(null, stats.Error);
    var doc = {
      id: newid,
      [foreignIdentifier]: teacherRep(args.userDoc),
      name: args.name,
      grade: args.grade,
      redline: args.redline,
      //times: args.times,
      max_mark: args.max || 0,
      /*curriculum: args.curriculum,
      strict: args.strict*/
      date: new Date()
    }
    //if (args.notes) doc.notes = args.notes;
    db.collection("exams").insertOne(doc, function (err, result) {
      ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error);
    })
  });
}
// edit max, strict, times, notes
function editExam(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var query = {};
  if (args.ig_name) query.name = args.ig_name;
  if (args.ig_redline) query.redline = args.ig_redline;
  if (args.ig_max) query.max_mark = args.ig_max;
  if (Object.keys(query).length < 0) return callback(null, stats.OK);
  db.collection("exams").updateOne({
    id: args.id,
    [foreignIdentifier]: teacherRep(args.userDoc)
  }, {
    $set: query
  }, (err, result) => {
    if (err) return callback(err);
    else return callback(null, stats.OK);
  })
}

function getExam(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("exams").findOne({
    id: args.id,
    [foreignIdentifier]: teacherRep(args.userDoc)
  }, {
    _id: 0,
    id: 0,
    [foreignIdentifier]: 0
  }, (err, result) => {
    if (err) return callback(err);
    else if (result) callback(null, stats.OK, result);
    else callback(null, stats.NonExisting);
  });
}

function getExams(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var restrictions = {
    _id: 0,
    id: 1,
    name: 1,
    grade: 1,
  };
  if (args.getdata) {
    restrictions.max_mark = 1;
    restrictions.redline = 1;
  }
  db.collection("exams").find({
    [foreignIdentifier]: teacherRep(args.userDoc),
    ...args.ig_grades && {
      grade: {
        $in: args.ig_grades
      }
    }
  }, restrictions).toArray(function (err, results) {
    if (err) callback(err);
    callback(null, stats.OK, results);
  });
}
// id
function removeExam(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("logs").deleteMany({
    exam: args.id,
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  }, function (err, result) {
    if (err) callback(err);
    db.collection("exams").deleteOne({
      id: args.id,
      [foreignIdentifier]: teacherRep(args.userDoc)
    }, function (err, res) {
      ErrorAndCount(callback, err, res, fields.deletedCount, stats.Error);
    });
  });
}
// student, id, mark, attendant
function addExamLog(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  var query = {
    // let the constants be in $set to minimize finding time
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    type: "exam",
  };
  if (typeof args.ig_mark != 'undefined') query.mark = args.ig_mark;
  if (typeof args.ig_attendant != 'undefined') query.attendant = args.ig_attendant;
  if (typeof query.mark == 'undefined' && typeof query.attendant == 'undefined') return callback(null, stats.OK);
  db.collection("logs").updateOne({
    // compound index on student and exam <id>
    [studentForeignIdentifier]: args.student,
    exam: args.id
  }, {
    $set: query
  }, {
    upsert: true
  }, function (err, result) {
    if (err) callback(err);
    if (result.upsertedId) {
      callback(null, stats.OK, {
        inserted: true
      });
      db.collection("exams").findOne({
        id: args.id
      }, {
        grade: 1,
        _id: 0
      }, function (err, result) {
        if (!err) {
          db.collection("logs").updateOne({
            [studentForeignIdentifier]: args.student,
            exam: args.id
          }, {
            $set: {
              grade: result.grade
            }
          }, () => {});
        }
      });
    } else callback(null, stats.OK, {
      modified: true
    });
  })
}

function setDefaultStartDate(args, callback) {
  db.collection('users').updateOne({
    teacherid: teacherRep(args.userDoc)
  }, {
    $pull: {
      defaultStartDates: {
        grade: args.grade
      }
    }
  }, (err) => {
    if (err) return callback(err);
    db.collection('users').updateOne({
      teacherid: teacherRep(args.userDoc)
    }, {
      $push: {
        defaultStartDates: {
          grade: args.grade,
          date: new Date(args.date)
        }
      }
    }, (err) => {
      if (err) callback(err);
      callback(null, stats.OK);
    });
  });
}

function getDefaultStartDates(args, callback) {
  db.collection('users').findOne({
    teacherid: teacherRep(args.userDoc)
  }, {
    grades: 1,
    defaultStartDates: 1,
    _id: 0
  }, (err, result) => {
    if (err) callback(err);
    else {

      callback(null, stats.OK, {
        grades: result.grades,
        startDates: result.defaultStartDates
      });
    }
  })
}

/*function refreshMissingClasses(args, callback) {
    createMissingClasses(teacherRep(args.userDoc), callback);
}

function createMissingClasses(refresherId, callback) {
    var matchingQuery = { usertype: 'teacher' };
    if (!isNaN(parseInt(refresherId))) matchingQuery.teacherid = refresherId;
    db.collection('users').aggregate([
        {
            $match: matchingQuery
        },
        {
            $lookup: {
                from: 'groupslinks',
                localField: 'teacherid',
                foreignField: 'teacherid',
                as: 'groupslinks'
            }
        },
        {
            $unwind: '$groupslinks'
        }, {
            $group: {
                _id: { groupslinks: { grade: "$groupslinks.grade" }, teacherid: '$teacherid', 'defaultStartDates': '$defaultStartDates' },
                links: { $push: '$groupslinks' }
            }
        }, {
            $project: {
                _id: 0,
                teacherid: "$_id.teacherid",
                grade: "$_id.groupslinks.grade",
                'links.classnum': 1,
                'links.links': 1,
                defaultStartDates: "$_id.defaultStartDates"
            }
        }], (err, teachers) => {
            if (err) {
                console.error('error creating missing classes');
                console.error(err);
            } else {
                for (let i = 0; i < teachers.length; i++) {
                    var days = [
                        'Sat',
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                    ];
                    function linksSorter(a, b) {
                        return a.day - b.day;
                    }
                    function generateNextDate(lastdate, classes) {
                        let lastday = lastdate.getDay() + 1;
                        if (lastday > 6) lastday = 0;
                        let classnum = null;
                        let nextClass = null;
                        for (let i = 0; i < classes.length; i++) {
                            const link = classes[i].sort(linksSorter)[0];
                            if (link.day > lastday) {
                                nextClass = link;
                                classnum = i;
                            }
                        }
                        if (!nextClass) {
                            nextClass = classes[0].sort(linksSorter)[0];
                            classnum = 0;
                        }
                        var incDays = nextClass.day - lastday;
                        if (incDays < 0) incDays += 7;
                        return { date: new Date(lastdate.getTime() + (1000 * 60 * 60 * 24 * incDays)), classnum: classnum };
                    }
                    const c_date = new Date();
                    if (teachers[i].defaultStartDates) {
                        //TODO update that value on refresh teacher classes
                        console.log({ teacherid: teachers[i].teacherid, grade: teachers[i].grade });
                        db.collection("classes").find({ teacherid: teachers[i].teacherid, grade: teachers[i].grade }, { _id: 0, date: 1, sort: { date: -1 }, limit: 1 }).toArray((err, lastclass) => {
                            var lastdate;
                            if (!err && lastclass[0]) lastdate = lastclass[0].date;
                            console.log("thelastdate: ", lastdate);
                            cFunc(lastdate ? new Date(lastdate) : lastdate);
                        });
                        var cFunc = (lastdate) => {
                            let links = [];
                            for (let index = 0; index < teachers[i].links.length; index++) {
                                if (teachers[i].links.length <= 0) break;
                                const element = teachers[i].links[index];
                                for (let li = 0; li < element.links.length; li++) {
                                    const link = element.links[li];
                                    element.links[li].dayText = days[link.day];
                                }
                                links[element.classnum] = element.links;
                            }
                            if (!lastdate) teachers[i].defaultStartDates.forEach(element => {
                                if (element.grade == teachers[i].grade) {
                                    lastdate = element.date;
                                }
                            });
                            if (lastdate) {
                                lastdate.setHours(0, 0, 0, 0);
                                let all_created = false;
                                // console.log(teachers[i].grade);
                                while (!all_created) {
                                    /*console.log(lastdate);
                                    console.log(c_date);
                                    console.log(lastdate);
                                    console.log(c_date);
                                    if (lastdate >= c_date) {
                                        /*console.log('all created');
                                        all_created = true;
                                        console.log(all_created);
                                        if (callback) callback(null, stats.OK);
                                        break;
                                    }
                                    let generated = generateNextDate(lastdate, links);
                                    lastdate = generated.date;
                                    var continueWorking = ()=>{
                                        mongoh.GetNextSequence(db, 'classes', {}, 'id', lib.IntIncrementer, (newid, syncs) => {
                                            var query = {
                                                id: newid,
                                                [teacherForeignIdentifier]: teachers[i].teacherid,
                                                grade: teachers[i].grade,
                                                date: syncs.d,
                                                classnum: syncs.c
                                            };
                                            db.collection("classes").insertOne(query, (err, result) => { if (!all_created) continueWorking(); });
                                        }, { c: generated.classnum, d: generated.date });
                                    }
                                    continueWorking();
                                }
                            }
                        }
                    }
                }
            }
        });
}*/
// 
function listTeachers(args, callback) {
  db.collection("users").find({
    usertype: 'teacher'
  }, {
    _id: 0,
    id: 1,
    displayname: 1,
    grades: 1
  }).toArray((err, teachers) => {
    if (err) callback(err);
    else callback(null, stats.OK, teachers);
  })
}

function logStudentsCount() {
  let d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  db.collection("links").aggregate([{
    $group: {
      _id: {
        teacherid: "$teacherid",
        grade: "$grade"
      },
      count: {
        $sum: 1
      }
    }
  }, {
    $project: {
      _id: 0,
      "teacherid": "$_id.teacherid",
      count: "$count",
      date: d,
      grade: "$_id.grade"
    }
  }], {}, (err, result) => {
    if (err) SaveError(err);
    else {
      for (let i = 0; i < result.length; i++) {
        const count = result[i];
        db.collection("counter").updateOne({
          date: d
        }, result[i], {
          upsert: true
        }, (err) => {
          if (err) SaveError(err);
        })
      }
    }
  });
}

var counterJob = new CronJob({
  cronTime: '00 00 3 * * *',
  onTick: logStudentsCount,
  start: true,
  timeZone: 'Egypt'
});

/*var job = new CronJob({
    cronTime: '00 00 5 * * *',
    onTick: createMissingClasses,
    start: true,
    timeZone: 'Egypt'
});*/
function connected() {
  // job.start();
  counterJob.start();
  //createMissingClasses();
}

function countGroupsLinks(args, callback) {
  db.collection("groupslinks").find({
    teacherid: teacherRep(args.userDoc),
    grade: args.grade
  }).count((err, count) => {
    if (err) callback(err);
    else callback(null, stats.OK, count);
  })
}

function initializeClass(args, callback) {
  var id;
  mongoh.GetNextSequence(db, 'classes', {}, 'id', lib.IntIncrementer, (newid) => {
    id = newid;
    var insert = () => {
      db.collection("classes").insertOne(query, (err, result) => {
        ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error, id);
      });
    }
    var query = {
      id: newid,
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade,
      date: new Date(args.date)
    };
    if (args.ig_addedClass) query.addedClass = true;
    if (!isNaN(parseInt(args.ig_classnum))) {
      query.classnum = args.ig_classnum;
      db.collection("groupslinks").findOne({
        classnum: args.ig_classnum
      }, {
        _id: 0,
        links: 1
      }, (err, result) => {
        if (result && !err) query.links = result.links;
        insert();
      });
    } else insert();
  });
}

function getClass(args, callback) {
  db.collection("classes").findOne({
    id: args.classid,
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  }, {
    grade: 1,
    _id: 0,
    addedClass: 1,
    date: 1
  }, (err, result) => {
    if (err) return callback();
    else if (result) callback(null, stats.OK, result);
    else callback(null, stats.NonExisting);
  });
}

/*

/* mongo 3.6 ----
.aggregate([{
        $match: {
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
            grade: args.grade
        }
    }, {
        $lookup: {
            from: 'logs',
            let: {
                teacherid: "$teacherid",
                studentid: "$studentid"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$teacherid", "$$teacherid"]
                            },
                            {
                                $eq: ["$studentid", "$$studentid"]
                            },
                            {
                                $eq: ["$classid", args.classid]
                            },
                            {
                                $eq: ["$type", "class"]
                            }
                   ]
                    }
                }
        }, {
                $project: {
                    _id: 0
                }
        }],
            as: 'log'
        }
}, {
        $project: {
            _id: 0,
            studentid: 1,
            grade: 1,
            fullname: 1,
            log: 1,
            groupid: {
                $cond: {
                    if: {
                        $ne: ["$log.groupid", []]
                    },
                    then: "$log.groupid",
                    else: "$group"
                }
            }
        }
},
    {
        $unwind: "$groupid"
},
    {
        $sort: {
            groupid: 1
        }
}]
*/

function listItems(args, callback) {
  db.collection("items").find({
    teacherid: teacherRep(args.userDoc),
    grade: args.grade
  }, {
    _id: 0
  }).sort({
    category: 1
  }).toArray((err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK, result);
  });
}

function listCategories(args, callback) {
  db.collection("items").aggregate([{
      $match: {
        teacherid: teacherRep(args.userDoc),
        grade: args.grade
      }
    },
    {
      $group: {
        _id: null,
        categories: {
          $addToSet: "$category"
        }
      }
    }
  ], (err, result) => {
    if (err) return callback(err);
    if (result[0]) callback(null, stats.OK, result[0].categories);
    else callback(null, stats.OK, []);
  });
}

function addItem(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  mongoh.GetNextSequence(db, 'items', {}, 'id', lib.IntIncrementer, function (newid) {
    if (typeof newid != 'number') return callback(null, stats.Error);
    const {
      name,
      grade,
      price,
      month,
      year
    } = args;
    db.collection("items").insertOne({
      id: newid,
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      name,
      grade,
      price,
      category: args.itemCategory,
      month,
      year,
    }, (err, result) => {
      ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error);
    })
  });
}

function removeItem(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("items").deleteOne({
    teacherid: teacherRep(args.userDoc),
    id: args.itemid,
  }, {
    _id: 0
  }, (err, result) => {
    if (err) callback(err);
    else {
      callback(null, stats.OK);
      db.collection("payments").deleteMany({
        teacherid: teacherRep(args.userDoc),
        itemid: args.itemid
      }, () => {});
    }
  });
}

function getItem(args, callback) {
  if (!isTeacherRep(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("items").findOne({
    teacherid: teacherRep(args.userDoc),
    id: args.itemid,
  }, {
    _id: 0
  }, (err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK, result);
  });
}

/*function applyPriceChange(args, callback) {
    var query = {
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        "itemid": args.itemid
    };
    db.collection("payments").updateMany(query, {
        $set: {
            "payed.price": args.price
        }
    }, (err, result) => {
        if (err) callback(err);
        else callback(null, stats.OK);
    })
}*/


function listPayments(args, callback) {
  db.collection("paylogs").aggregate([{
    $match: {
      $and: [{
          date: {
            $gte: lib.stripDate(args.comparingDate)
          }
        },
        {
          date: {
            $lte: lib.stripDate(args.date, true)
          }
        },
      ]
    }
  }, {
    $sort: {
      date: 1
    }
  }], (err, paylogs) => {
    if (err) callback(err);
    callback(null, stats.OK, paylogs);
  })
}

function addPayLog(args, callback) {
  db.collection("paylogs").insertOne({
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    payed: args.payedAmount,
    name: args.name,
    date: new Date(args.date),
  }, (err, result) => {
    ErrorAndCount(callback, err, result, fields.insertedCount, stats.Error);
  });
}

function setPayLog(args, callback) {
  if (args.payedAmount == 0) {
    db.collection("paylogs").deleteOne({
      _id: new mongodb.ObjectID(args._id)
    }, (err, result) => {
      ErrorAndCount(callback, err, result, fields.deletedCount, stats.Error);
    });
  } else {
    db.collection("paylogs").updateOne({
      _id: args._id
    }, {
      payed: args.payedAmount
    }, (err, result) => {
      ErrorAndCount(callback, err, result, fields.modifiedCount, stats.Error);
    });
  }
}

function setPayment(args, callback) {
  var query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    [studentForeignIdentifier]: args.student,
    "itemid": args.itemid
  };

  const recordPayLog = (payed) => {
    db.collection("payments").aggregate([{
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: studentForeignIdentifier,
          foreignField: identifier,
          as: 'student',
        }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'itemid',
          foreignField: 'id',
          as: 'item',
        }
      }
    ], (err, payment) => {
      if (err) return;


      payment = payment[0];

      payment.student = payment.student[0];
      payment.item = payment.item[0];

      if (payed == undefined) {
        payed = payment.payed;
      }

      const paylogAmount = args.payedAmount - payed;

      if (paylogAmount == 0) {
        return;
      }

      const added = args.payedAmount > payed;

      let message = [];

      message.push(added ? 'دفع' : 'سحب');
      message.push(payment.student.fullname.trim());
      message.push('فلوس');
      message.push(itemCategoryNames[payment.item.category]);
      message.push(payment.item.name);

      addPayLog({
        userDoc: args.userDoc,
        name: message.join(' '),
        payedAmount: paylogAmount,
        date: new Date()
      }, () => {});
    });
  };

  // delete payment
  if (args.payedAmount == 0) {
    recordPayLog();
    db.collection("payments").deleteOne(query, (err, result) => {
      if (err) {
        return callback(err);
      } else {
        callback(null, stats.OK);
      }
    })
    return;
  }

  var updateQuery = {
    payed: args.payedAmount,
    discount: args.discount,
    date: new Date()
  };

  db.collection("payments").findOne(query, {
    payed: 1
  }, (err, payment) => {
    if (err) {
      return callback(err);
    }
    db.collection("payments").updateOne(query, {
      $set: updateQuery
    }, {
      upsert: true
    }, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, stats.OK, lib.OverlayArray(query, updateQuery));
        recordPayLog(payment ? payment.payed : 0);
      }
    });
  });

}

function fetchPaymentLogs(args, callback) {
  /* mongo 3.4 */
  db.collection("links").aggregate([{
    $match: {
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }
  }, {
    $sort: {
      group: 1
    }
  }, {
    $lookup: {
      from: 'users',
      localField: studentForeignIdentifier,
      foreignField: identifier,
      as: 'user_data'
    }
  }], (err, links) => {
    if (err) return callback(err);
    else if (links) {
      db.collection("payments").find({
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        itemid: args.itemid
      }, {
        _id: 0
      }).toArray((err, payments) => {
        if (err) return callback(err);
        else {
          // get indexes & ids out first
          var ids = {};
          for (var i = 0; i < payments.length; i++) {
            ids[payments[i].studentid] = i;
          }
          for (var i = 0; i < links.length; i++) {
            var index = ids[links[i].studentid];
            if (!isNaN(index)) {
              links[i].log = payments[index];
            }
          }
          links = links.map(link => {
            return {
              ...link,
              user_data: link.user_data[0],
            }
          })
          callback(null, stats.OK, links);
        }
      });
    } else callback(null, stats.EmptyData);
  });
}

function fetchClassLogs(args, callback) {

  /* mongo 3.4 */
  let query = [{
    $match: {
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }
  }];

  if (args.ig_getcontacts) {
    query.push({
      $lookup: {
        from: 'phones',
        localField: studentForeignIdentifier,
        foreignField: foreignIdentifier,
        as: 'contacts'
      }
    });
  }

  db.collection("links").aggregate(query).sort({
    group: 1
  }).toArray((err, links) => {
    if (err) return callback(err);
    else if (links) {
      db.collection("logs").find({
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        classid: args.classid
      }, {
        _id: 0,
        classid: 0
      }).toArray((err, logs) => {
        if (err) return callback(err);
        else {
          // get indexes & ids out first
          var ids = {};
          for (var i = 0; i < logs.length; i++) {
            ids[logs[i].studentid] = i;
          }
          for (var i = 0; i < links.length; i++) {
            var index = ids[links[i].studentid];
            if (!isNaN(index)) {
              if (!logs[index].groupid) logs[index].groupid = links[i].group;
              links[i].log = logs[index];
            } else {
              links[i].log = {
                groupid: links[i].group
              };
            }
          }
          callback(null, stats.OK, links);
        }
      });
    } else callback(null, stats.EmptyData);
  });
}

function fetchExamLogs(args, callback) {

  let query = [{
    $match: {
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    }
  }]

  if (args.ig_getcontacts) {
    query.push({
      $lookup: {
        from: 'phones',
        localField: studentForeignIdentifier,
        foreignField: foreignIdentifier,
        as: 'contacts'
      }
    });
  }
  /* mongo 3.4 */
  db.collection("links").aggregate(query, (err, links) => {
    if (err) return callback(err);
    else if (links) {
      var ids = {};
      for (var i = 0; i < links.length; i++) {
        ids[links[i].studentid] = i;
      }
      db.collection("logs").find({
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        exam: args.id,
        type: 'exam'
      }, {
        _id: 0,
        exam: 0
      }).toArray((err, logs) => {
        if (err) return callback(err);
        else {
          for (var i = 0; i < logs.length; i++) {
            var index = ids[logs[i].studentid];
            if (!isNaN(index)) {
              links[index].log = logs[i];
            }
          }
          callback(null, stats.OK, links);
        }
      });
    } else callback(null, stats.EmptyData);
  });
}

function listClasses(args, callback) {
  db.collection("classes").find({
    grade: args.grade,
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  }, {
    _id: 0,
    [teacherForeignIdentifier]: 0,
    'links.groupid': 0
  }).sort({
    date: -1
  }).toArray((err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK, result);
  });
}

function deleteClass(args, callback) {
  db.collection("classes").deleteOne({
    [identifier]: args.classid,
    [teacherForeignIdentifier]: teacherRep(args.userDoc)
  }, (err, result) => {
    //TODO test
    db.collection("logs").deleteMany({
      classid: args.classid,
      type: 'class',
      [teacherForeignIdentifier]: teacherRep(args.userDoc)
    }, () => {});
    ErrorAndCount(callback, err, result, fields.deletedCount, stats.NonExisting);
  })
}

function requestParentToken(args, callback) {
  db.collection("users").findOne({
    code: args.code.toLowerCase()
  }, {
    _id: 0,
    [identifier]: 1,
    fullname: 1
  }, (err, result) => {
    if (err) return callback(err);
    if (result) {
      var token = genPass.generate({
        length: 64,
        numbers: true
      });
      db.collection("parentTokens").insertOne({
        [studentForeignIdentifier]: result.id,
        fullname: result.fullname,
        token: token,
        date: new Date()
      }, (err, result) => {
        if (err) callback(err);
        else callback(null, stats.OK, token);
      });
    } else callback(null, stats.UserNonExisting);
  });
}

function getLinks(args, callback) {
  db.collection("links").aggregate([{
      $match: {
        [studentForeignIdentifier]: args.targetuser
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'teacherid',
        foreignField: 'id',
        as: 'teachers_data'
      }
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'group',
        foreignField: 'id',
        as: 'group_data'
      }
    },
    {
      $project: {
        _id: 0,
        teacherid: 1,
        grade: 1,
        'teachers_data.displayname': 1,
        'teachers_data.subjects': 1,
        'group_data.name': 1
      }
    }
  ], (err, links) => {
    if (err) callback(err);
    else callback(null, stats.OK, links);
  })
}

function getInfoForParent(args, callback) {
  db.collection("parentTokens").findOne({
    token: args.parenttoken
  }, {
    _id: 0
  }, (err, result) => {
    if (err) return callback(err);
    if (result) {
      db.collection("links").aggregate([{
          $match: {
            [studentForeignIdentifier]: result[studentForeignIdentifier]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'teacherid',
            foreignField: 'id',
            as: 'teachers_data'
          }
        },
        {
          $lookup: {
            from: 'groups',
            localField: 'group',
            foreignField: 'id',
            as: 'group_data'
          }
        },
        {
          $project: {
            _id: 0,
            teacherid: 1,
            grade: 1,
            'teachers_data.displayname': 1,
            'teachers_data.subjects': 1,
            'group_data.name': 1
          }
        }
      ], (err, links) => {
        if (err) callback(err);
        else callback(null, stats.OK, {
          fullname: result.fullname,
          links: links
        });
      })
    } else return callback(null, stats.InvalidToken);
  });
}
// teacher, time period
function fetchLogsForParent(args, callback) {
  db.collection("parentTokens").findOne({
    token: args.parenttoken
  }, {
    _id: 0,
    [studentForeignIdentifier]: 1
  }, (err, result) => {
    if (err) return callback(err);
    if (result) {
      var fetchArgs = {
        userDoc: {
          id: args.teacher,
          teacherid: args.teacher,
          usertype: 'teacher'
        },
        grade: args.grade,
        targetuser: result.studentid
      };
      if (args.datePeriod) fetchArgs.datePeriod = args.datePeriod;
      fetchLogs(fetchArgs, callback);
    } else return callback(null, stats.InvalidToken);
  });
}

function fetchLogs(args, callback) {
  let exam_query = {
    [foreignIdentifier]: teacherRep(args.userDoc),
    grade: args.grade
  };
  if (args.datePeriod) {
    exam_query['$and'] = [{
        date: {
          $gte: args.datePeriod.start
        }
      },
      {
        date: {
          $lte: args.datePeriod.end
        }
      }
    ]
  }
  db.collection("exams").find(exam_query, {
    _id: 0
    // id for exams because date cannot be edited
  }).sort({
    id: -1
  }).toArray((err, exams) => {
    if (err) return callback(err);
    let class_query = {
      [teacherForeignIdentifier]: teacherRep(args.userDoc),
      grade: args.grade
    };
    if (args.datePeriod) {
      class_query['$and'] = [{
          date: {
            $gte: args.datePeriod.start
          }
        },
        {
          date: {
            $lte: args.datePeriod.end
          }
        }
      ]
    }
    db.collection("classes").find(class_query, {
      _id: 0
      // date because classes are can be added without order
    }).sort({
      date: -1
    }).toArray((err, classes) => {
      if (err) return callback(err);
      db.collection("logs").find({
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        [studentForeignIdentifier]: args.targetuser
      }, {
        _id: 0
      }).toArray((err, logs) => {
        var classesLogs = {};
        var examsLogs = {};
        for (var i = 0; i < logs.length; i++) {
          var log = logs[i];
          if (log.type == 'class') {
            classesLogs[log.classid] = log;
          } else if (log.type == 'exam') {
            examsLogs[log.exam] = log;
          }
        }
        for (var i = 0; i < classes.length; i++) {
          var clog = classesLogs[classes[i].id];
          if (clog) {
            classes[i].log = clog;
          }
        }
        for (var i = 0; i < exams.length; i++) {
          var elog = examsLogs[exams[i].id];
          if (elog) {
            exams[i].log = elog;
          }
        }
        db.collection('items').find({
          [teacherForeignIdentifier]: teacherRep(args.userDoc),
          grade: args.grade
        }, {
          _id: 0,
          name: 1,
          price: 1,
          id: 1
        }).toArray((err, items) => {
          if (err) return callback(err);
          db.collection('payments').find({
            [teacherForeignIdentifier]: teacherRep(args.userDoc),
            [studentForeignIdentifier]: args.targetuser
          }, {
            _id: 0,
          }).toArray((err, payments) => {
            if (err) return callback(err);
            let itemsids = {};
            for (let i = 0; i < payments.length; i++) {
              itemsids[payments[i].itemid] = i;
            }
            for (let i = 0; i < items.length; i++) {
              if (typeof itemsids[items[i].id] == 'number') {
                items[i].log = payments[itemsids[items[i].id]];
              }
            }
            callback(null, stats.OK, {
              exams: exams,
              classes: classes,
              items: items
            });
          });
        });
      })
    });
  });
}

async function count(args, callback) {
  const returner = {};
  db.collection("links").count((err, linksCount) => {
    if (err) return callback(err);
    returner.linksCount = linksCount
    db.collection("links").aggregate([{
      $group: {
        _id: "$studentid"
      }
    }], (err, studentsCount) => {
      if (err) return callback(err);
      returner.studentsCount = studentsCount.length;
      db.collection("links").aggregate([{
        $match: {
          grade: args.ig_grade
        }
      }, {
        $group: {
          _id: "$studentid"
        }
      }], (err, gradeCount) => {
        if (err) return callback(err);
        returner.gradeCount = gradeCount.length;
        db.collection("links").aggregate([{
          $match: {
            group: args.ig_groupid
          }
        }, {
          $group: {
            _id: "$studentid"
          }
        }], (err, groupCount) => {
          if (err) return callback(err);
          returner.groupCount = groupCount.length;
          callback(null, stats.OK, returner);
        });
      });
    });
  });
}

function briefLog(args, callback) {
  db.collection("links").aggregate([{
      $match: {
        [teacherForeignIdentifier]: teacherRep(args.userDoc),
        [studentForeignIdentifier]: args.targetuser
      }
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'group',
        foreignField: 'id',
        as: 'group_data'
      }
    },
    {
      $project: {
        _id: 1,
        grade: 1,
        fullname: 1,
        'group_data.name': 1,
        'group_data.id': 1
      }
    }
  ], (err, data) => {
    if (err) return callback(err);
    if (!data || !data[0]) return callback(null, stats.UserNonExisting);
    if (data[0].group_data) data[0].group_name = data[0].group_data[0].name;
    if (data[0].group_data) data[0].group_id = data[0].group_data[0].id;
    if (data[0].group_data) delete data[0].group_data;
    data = data[0];
    db.collection("classes").aggregate([{
      $match: {
        teacherid: teacherRep(args.userDoc),
        grade: data.grade
      }
    }, {
      $sort: {
        date: -1
      }
    }, {
      $limit: 4
    }, {
      $project: {
        _id: 0,
        id: 1,
        date: 1,
        classnum: 1,
      }
    }], (err, classes) => {
      if (err) callback(err);
      db.collection("exams").aggregate([{
        $match: {
          userid: teacherRep(args.userDoc),
          grade: data.grade
        }
      }, {
        $sort: {
          date: -1
        }
      }, {
        $limit: 3
      }, {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          max_mark: 1,
          redline: 1,
        }
      }], async (err, exams) => {
        if (err) {
          callback(err);
        } else {
          const subscriptions = generateSubscriptions(data);
          try {
            for (let i = 0; i < classes.length; i++) {
              const teacherClass = classes[i];
              const log = await resolveClassLog(args.targetuser, teacherClass.id);
              classes[i] = {
                ...teacherClass,
                log: [log],
              };
            }
            for (let i = 0; i < exams.length; i++) {
              const exam = exams[i];
              const log = await resolveExamLog(args.targetuser, exam.id);
              exams[i] = {
                ...exam,
                log: [log],
              };
            }
            for (let i = 0; i < subscriptions.length; i++) {
              const subscription = subscriptions[i];
              const resolved = await resolveSubscriptionLog(args.targetuser, subscription);
              subscriptions[i] = {
                ...subscription,
                ...resolved,
              };
            }
          } catch (e) {}
          callback(null, stats.OK, {
            data,
            classes,
            exams,
            subscriptions,
          });
        }
      })
    })
  });
}

function generateSubscriptions(data) {
  const miminumDate = new ObjectId(data._id).getTimestamp();
  const groundedMinimumDate = new Date(groundMonth(miminumDate));
  const subscriptions = [];
  for (let i = 0; i < 5; i++) {
    const generatedDate = moment().subtract(i, 'months').toDate();
    const groundedGeneratedDate = groundMonth(generatedDate);
    if (groundedGeneratedDate >= groundedMinimumDate) {
      subscriptions.push(generateSubscription(generatedDate, data.grade));
    }
  }
  return subscriptions;
}

/**
 * @param  {Date} date
 */
function groundMonth(date) {
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  return date;
}

function generateSubscription(date, grade) {
  return {
    month: Number(moment(date).format('M')),
    year: Number(moment(date).format('YYYY')),
    grade,
  }
}

/**
 * Payment subscription
 * @typedef {Object} Subscription
 * @property {number} month Month of year
 * @property {number} year Year of subscription
 * @property {number} grade Subscription grade id
 */

/**
 * Resolve a month payment log
 * @param  {number} studentid Target student id
 * @param  {Subscription} subscription Target class id
 * @returns {Promise} Promise that resolves into the class log
 */
function resolveSubscriptionLog(studentid, subscription) {
  return new Promise((resolve, reject) => {
    db.collection('items').findOne(subscription, (error, item) => {
      if (error) {
        reject(error);
        return;
      }
      if (item) {
        db.collection('payments').findOne({
          itemid: item.id,
          studentid,
        }, (error, log) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            item,
            log
          });
        });
      } else {
        resolve();
      }
    });
  })
}

/**
 * Resolve a class log
 * @param  {number} studentid Target student id
 * @param  {number} classid Target class id
 * @returns {Promise} Promise that resolves into the class log
 */
function resolveClassLog(studentid, classid) {
  return new Promise((resolve, reject) => {
    db.collection('logs').findOne({
      studentid,
      classid,
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })
}

/**
 * Resolve an class log
 * @param  {number} studentid Target student id
 * @param  {number} examid Target exam id
 * @returns {Promise} Promise that resolves into the class log
 */
function resolveExamLog(studentid, examid) {
  return new Promise((resolve, reject) => {
    db.collection('logs').findOne({
      studentid,
      exam: examid,
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })
}

function addClassLog(args, callback) {
  var query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    [studentForeignIdentifier]: args.student,
    "type": "class",
    "classid": args.classid,
  };
  var updateQuery = {};
  if (typeof args.ig_groupid == 'number') updateQuery.groupid = args.ig_groupid;
  if (typeof args.ig_attendant == 'boolean') updateQuery.attendant = args.ig_attendant;
  if (args.homework) updateQuery.homework = args.homework;
  if (args.quiz) updateQuery.quiz = args.quiz;
  if (Object.keys(updateQuery).length <= 0) return callback(null, stats.OK);
  db.collection("logs").updateOne(query, {
    $set: updateQuery
  }, {
    upsert: true
  }, (err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK);
  });
}

function globalClassLog(args, callback) {
  var query = {
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    "type": "class",
    "classid": args.classid,
  };
  var updateQuery = {};
  if (args.globalHomeworkType) updateQuery['homework.type'] = args.globalHomeworkType;
  if (args.globalQuizType) updateQuery['quiz.type'] = args.globalQuizType;
  if (args.globalHomeworkMax) updateQuery['homework.max'] = args.globalHomeworkMax;
  if (args.globalQuizMax) updateQuery['quiz.max'] = args.globalQuizMax;
  if (Object.keys(updateQuery).length <= 0) return callback(null, stats.OK);
  db.collection("logs").updateOne(query, {
    $set: updateQuery
  }, {}, (err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK);
  });
}

function clearLog(args, callback) {
  db.collection("logs").deleteOne({
    [teacherForeignIdentifier]: teacherRep(args.userDoc),
    [studentForeignIdentifier]: args.targetuser,
    [args.type == 'class' ? 'classid' : 'exam']: args.id
  }, (err, result) => {
    if (err) return callback(err);
    ErrorAndCount(callback, err, result, fields.deletedCount, stats.NonExisting);
  })
}

// EREG TEACHERS

// REG STUDENTS
/*//TODO
function enroll(args, callback) {
    if (args.userDoc.usertype == "teacher") {
        callback(null, stats.IncapableUserType);
        return;
    }
    db.collection("bids").findOne({
        id: args.id
    }, {}, function(err, bid) {
        if (err) return callback(err);
        var warnings = [];
        if (!args.userDoc.subs) args.userDoc.subs = [];
        if (!bid.open) callback(null, stats.BidClosed);
        if (bid.grade != args.userDoc.grade) warnings.push(warns.AnotherGrade);
        if (bid.grade != args.userDoc.subs.indexOf()) warnings.push(warns.MoreThanOneSubject);
    })
}*/

function editGrade(args, callback) {
  if (!isStudent(args.userDoc)) return callback(null, stats.IncapableUserType);
  db.collection("users").updateOne({
    "username": student(args.userDoc)
  }, {
    $set: {
      "grade": args.grade
    }
  }, function (err, result) {
    if (err) return callback(err);
    else if (result.matchedCount == 1) callback(null, stats.OK);
    else callback(null, stats.UserNonExisting);
  });
}

function getGrade(args, callback) {
  if (isStudent(args.userDoc) && !args.targetuser) args.targetuser = student(args.userDoc);
  db.collection("users").findOne({
    "username": args.targetuser
  }, {
    grade: 1
  }, function (err, result) {
    if (err) return callback(err);
    else callback(null, stats.OK, result.grade);
  });
} // EREG STUDENTS

// ADB

var adb = require('adbkit');
var Promise = require('bluebird')
var client = adb.createClient();
const spawn = require('await-spawn')

async function sendSMS(args, callback) {
  args.message += "\ns";
  try {
    switch (args.adb_protocol) {
      case 'shellms':
        await spawn('adb', [
          '-s',
          args.serial,
          'shell',
          'am',
          'startservice',
          '-n',
          'com.android.shellms/.sendSMS',
          '-e',
          'contact',
          args.recipient,
          '-e',
          'msg',
          '"' + args.message + '"'
        ])
        break;
      case 'legacy':
        await spawn('adb', [
          '-s',
          args.serial,
          'shell',
          'am',
          'start',
          '-a',
          'android.intent.action.SENDTO',
          '-d',
          'sms:' + args.recipient,
          '--es',
          'sms_body',
          '"' + args.message + '"',
          '--ez',
          'exit_on_sent',
          'true',
        ]);
        await setTimeout(() => {}, args.threshold);
        await spawn('adb', [
          '-s',
          args.serial,
          'shell',
          'input',
          'keyevent',
          '22'
        ]);
        await setTimeout(() => {}, args.threshold);
        await spawn('adb', [
          '-s',
          args.serial,
          'shell',
          'input',
          'keyevent',
          '66'
        ]);
        break;
    }
    callback(null, stats.OK);
  } catch (err) {
    callback(null, stats.Failed);
  }
}

function getStudentNotesAndDiscount(args, callback) {
  db.collection('users').findOne({
    id: args.id
  }, {}, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, stats.OK, result)
  })
}

function updateStudentNotesAndDiscount(args, callback) {
  let payload = {};

  if (args.studentDiscount) payload.discount = args.studentDiscount;
  if (args.notes) payload.notes = args.notes;

  if (!Object.keys(payload).length > 0) return callback(null, stats.OK);

  db.collection('users').updateOne({
    [identifier]: args.id,
  }, {
    $set: payload
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.Error);
  });
}

function getNameAndSubjects(args, callback) {
  db.collection('users').findOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    _id: 0,
    fullname: 1,
    subjects: 1,
  }, (err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK, {
      name: result.fullname,
      subjects: result.subjects
    })
  });
}

function UpdateBeeps(args, callback) {
  db.collection('users').updateOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    $set: {
      beeps: args.beeps,
    }
  }, (err, result) => {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.Error);
  });
}

function GetBeeps(args, callback) {
  db.collection('users').findOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    _id: 0,
    beeps: 1
  }, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, stats.OK, result);
  });
}

function updateNameAndSubjects(args, callback) {
  db.collection('users').updateOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    $set: {
      fullname: `${args.fullname.first} ${args.fullname.father} ${args.fullname.grand} ${args.fullname.last}`.replace('  ', '').trim(),
      subjects: args.subjects,
    }
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.Error);
  });
}

function getGradings(args, callback) {
  db.collection('users').findOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    _id: 0,
    gradings: 1,
  }, (err, result) => {
    if (err) callback(err);
    else callback(null, stats.OK, {
      gradings: result.gradings
    })
  });
}

function updateGradings(args, callback) {
  db.collection('users').updateOne({
    [identifier]: teacherRep(args.userDoc),
  }, {
    $set: {
      gradings: args.gradings,
    }
  }, function (err, result) {
    ErrorAndCount(callback, err, result, fields.matchedCount, stats.Error);
  });
}

function listDevices(args, callback) {
  client.listDevices()
    .then(function (devices) {
      return Promise.map(devices, function (device) {
        return client.getProperties(device.id)
          .then(function (props) {
            return {
              id: device.id,
              name: `${props['ro.product.brand']} ${props['ro.product.model']}`
            };
          })
      })
    })
    .then(devices => {
      callback(null, stats.OK, devices ? devices : []);
    })
    .catch(callback)
};

// REG PROFILES
// EREG PROFILES
module.exports = {
  // CONSTANTS
  _stats: stats,
  _extensions: extensions,
  identifier: identifier,
  foreignIdentifier: foreignIdentifier,
  teacherForeignIdentifier: teacherForeignIdentifier,
  studentForeignIdentifier: studentForeignIdentifier,
  // VARIABLE GETTERS
  _loaded: getLoaded,
  // BASE API FUNCTIONS
  isAlive: _isAlive,
  Pass: _pass,
  // MAIN FUNCTIONS
  ChangePassword: changePassword,
  // ADMIN FUNCTIONS
  RegisterTeacher: registerTeacher,
  // API SHARED FUNCTIONS
  Authorize: authorize,
  ValidatePhoneCode: validatePhoneCode,
  /* temporary as fuck !! */
  SetPhone: setPhone,
  EditPhone: editPhone,
  GetPhones: getPhones,
  RemovePhones: removePhones,
  AddAddress: addAddress,
  GetAddresses: getAddresses,
  RemoveAddress: removeAddresses,
  /*CheckTimetableCollision: checkTimetableCollision,*/
  Upload: upload,
  ContinueUpload: continueUpload,
  PrepareUpload: prepareUpload,
  DeleteFiles: deleteFiles,
  Download: download,
  GetFilesInfo: getFilesInfo,
  SearchStudents: SearchStudents,
  // TEACHERS
  Bid: bid,
  GetBids: getBids,
  /*AddSubjects: addSubjects,
  GetSubjects: getSubjects,
  RemoveSubjects: removeSubjects,*/
  GetBio: getBio,
  EditBio: editBio,
  Post: post,
  EditPost: editPost,
  RemovePost: removePost,
  SetSuperTTDefaults: setSuperTTDefaults,
  GetSuperTTDefaults: getSuperTTDefaults,
  SetDefaultPhoneCode: setDefaultPhoneCode,
  GetDefaultPhoneCode: getDefaultPhoneCode,
  GetGrades: getGrades,
  //EditGrades: editGrades,
  RegisterStudent: registerStudent,
  RenameStudent: renameStudent,
  GetStudent: getStudent,
  LinkStudent: linkStudent,
  EditLink: editLink,
  UnlinkStudent: unlinkStudent,
  AddExam: addExam,
  EditExam: editExam,
  GetExams: getExams,
  GetExam: getExam,
  RemoveExam: removeExam,
  CreateGroup: createGroup,
  ListGroups: listGroups,
  EditGroup: editGroup,
  GetGroup: getGroup,
  DistinctGroups: distinctGroups,
  RemoveGroup: removeGroup,
  LogExam: addExamLog,
  ListStudents: listStudents,
  ListContacts: listContacts,
  CountStudents: countStudents,
  InitializeClass: initializeClass,
  DeleteClass: deleteClass,
  GetClass: getClass,
  AddClassLog: addClassLog,
  FetchLogs: fetchLogs,
  FetchClassLogs: fetchClassLogs,
  FetchExamLogs: fetchExamLogs,
  BriefLog: briefLog,
  ClearLog: clearLog,
  ListClasses: listClasses,
  CreateSecretary: createSecretary,
  RemoveSecretary: removeSecretary,
  AddItem: addItem,
  ListItems: listItems,
  SetPayment: setPayment,
  AddPayLog: addPayLog,
  SetPayLog: setPayLog,
  ListPayments: listPayments,
  ListCategories: listCategories,
  QRListStudents: qrListStudents,
  GetItem: getItem,
  FetchPaymentLogs: fetchPaymentLogs,
  RemoveItem: removeItem,
  RequestParentToken: requestParentToken,
  GetInfoForParent: getInfoForParent,
  FetchLogsForParent: fetchLogsForParent,
  ListGradeMonths: listGradeMonths,
  // STUDENTS
  EditGrade: editGrade,
  GetGrade: getGrade,
  // PROFILES
  UpdateNameAndSubjects: updateNameAndSubjects,
  GetNameAndSubjects: getNameAndSubjects,
  UpdateGradings: updateGradings,
  GetGradings: getGradings,
  UpdateStudentNotesAndDiscount: updateStudentNotesAndDiscount,
  GetStudentNotesAndDiscount: getStudentNotesAndDiscount,
  GetLinks: getLinks,

  UpdateBeeps,
  GetBeeps,

  // GRADES
  CreateGrade: createGrade,
  ListGrades: listGrades,
  UpdateGrade: updateGrade,
  DeleteGrade: deleteGrade,

  // VALIDATORS
  validators: validators,

  // STATISTICS
  Count: count,

  LinkGroupClasses: linkGroupClasses,
  ListGroupClassesLinks: listGroupClassesLinks,
  RemoveGroupClass: removeGroupClass,
  CountGroupsLinks: countGroupsLinks,
  //بتنجان
  GetDefaultStartDates: getDefaultStartDates,
  SetDefaultStartDate: setDefaultStartDate,
  RefreshMissingClasses: null,
  // مش بتنجان
  ListTeachers: listTeachers,
  // adb
  ListDevices: listDevices,
  SendSMS: sendSMS,
};