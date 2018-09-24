#!/bin/bash node
 // high resolution time measurement
// turn off that hard disk indexing thing for mongo

const fs = require("fs");
const express = require('express');
const data = require('../data');
const extensions = data._extensions;
const cors = require('cors');
const bodyParser = require('body-parser');
const streamRes = require('stream-res');
const validators = require('../validators')(data);
var router = express.Router();
var stats = data._stats;
const objectValues = require('object.values');
const performance_now = require("performance-now");
const lib = require("../library");
var defParam = lib.defParam;
var date = lib.jsDate;

function finishAPIRequest(obj) {
  return JSON.stringify(obj);
}

function readAPIRequest(body, jsonlength) {
  if (jsonlength && typeof body == 'object') {
    var json = body.slice(0, jsonlength).toString();
    var returner;
    try {
      returner = {
        buffer: body.slice(jsonlength, body.length),
        json: JSON.parse(json)
      };
    } catch (e) {
      returner = {
        error: true
      };
    }
    return returner;
  } else try {
    return {
      json: JSON.parse(body)
    };
  } catch (e) {
    return {
      error: true
    };
  }
}

function SaveError(err) {
  var d = date();
  console.error("Error caught on: " + d);
  if (err) {
    if (err.err) {
      try {
        sendStat(err.res, stats.Error);
      } catch (e) {}
      err = err.err;
    }
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

// REG STAT_SENDERS

function sendStat(res, stat, result) {
  try {
    if (typeof result != 'undefined') {
      res.send(finishAPIRequest({
        stat: stat,
        result: result
      }));
    } else {
      res.send(finishAPIRequest({
        stat: stat
      }));
    }
  } catch (e) {
    SaveError(e);
  }
}

function InvalidData(res, key, data) {
  var result = {
    key: key
  };
  if (data) result.data = data;
  sendStat(res, stats.InvalidData, result);
}

function InvalidToken(res, data) {
  sendStat(res, stats.InvalidToken);
}

function Error(res, err) {
  SaveError(err);
  sendStat(res, stats.Error);
}

// EREG

var inputvalidators = {
  // changepassword
  "oldpassword": validators.ValidatePassword,
  // register for students
  "username": validators.ValidateUsername,
  "email": validators.ValidateEmail,
  "password": validators.ValidatePassword,
  "fullname": validators.ValidateFullName,
  // authorize
  "login": validators.ValidateString,
  "model": validators.ValidateObject,
  "device": validators.ValidateDevice,
  // api calls
  "token": validators.ValidateToken,
  // deAuthorize
  "unique": validators.ValidateNumber,
  // add phone
  "phonecode": validators.ValidateOrIgnorePhoneCode,
  "number": validators.ValidateOrIgnoreNumberString,
  "phonetype": validators.ValidateOrIgnorePhoneType,
  delete: validators.ValidateOrIgnoreBoolean,
  // edit phone
  "id": validators.ValidateNumber,
  "new_phonecode": validators.ValidateOrIgnorePhoneCode,
  "new_number": validators.ValidateOrIgnoreNumberString,
  "new_phonetype": validators.ValidateOrIgnorePhoneType,
  // get reference (phones, addresses)
  "startid": validators.ValidateOrGiveStartID,
  "limit": validators.ValidateOrGiveLimit,
  "ig_ids": validators.ValidateOrIgnoreNumberArray,
  // remove by ids (phones, addresses)
  "ids": validators.ValidateNumberArray,
  // add address
  "name": validators.ValidateString,
  "coordinates": validators.ValidateCoordinates,
  "address": validators.ValidateOrIgnoreString,
  "phones": validators.ValidateOrIgnorePhones,
  "addresstype": validators.ValidateAddressType,
  // bid
  "title": validators.ValidateOrIgnoreString,
  "prices": validators.ValidatePrices,
  "grade": data.validators.ValidateGrade,
  "start_date": validators.ValidateDate,
  "end_date": validators.ValidateBidEndDate,
  "bidtype": data.validators.ValidateBidType,
  "addresses": validators.ValidateAddresses,
  "gender": validators.ValidateGender,
  "subjects": data.validators.ValidateSubjects,
  "timetables": validators.ValidateTimetables,
  // timetable collision
  "ttcoll_usernames": validators.ValidateOrIgnoreStringArray,
  "ttcoll_ids": validators.ValidateOrIgnoreNumberArray,
  "start_time": validators.ValidateStartTime,
  "days": validators.ValidateOrIgnoreDays,
  "period": validators.ValidateNumber,
  // get subjects
  "targetuser": validators.ValidateOrIgnoreNumber,
  // prepare upload
  "checksum": validators.ValidateString,
  "size": validators.ValidateNumber,
  "extension": validators.ValidateExtension,
  "permissions": validators.ValidatePermissions,
  // upload
  //INFO bytes_range is linked to size
  "bytes_range": validators.ValidateBytesRange,
  // post
  "media_ids": validators.ValidateOrIgnoreMediaIds,
  "text": validators.ValidateString,
  // editPost
  "new_media_ids": validators.Pass,
  //INFO abs_bytes_range is not linked to size
  "abs_bytes_range": validators.ValidateAbsBytesRange,
  // set super timetable defaults
  "days": validators.ValidateOrIgnoreDays,
  "whours": validators.ValidateOrIgnoreTimeRange,
  "duration": validators.ValidateOrIgnoreTimePeriod,
  "break": validators.ValidateOrIgnoreTimePeriod,
  "fbreak": validators.ValidateOrIgnoreTimePeriod,
  // edit grades
  "grades": validators.ValidateGrades,
  // link student
  "student": validators.ValidateNumber,
  "group": validators.ValidateGroup,
  // add exam
  "times": validators.ValidateTimes,
  "notes": validators.ValidateOrIgnoreString,
  "curriculum": validators.ValidateString,
  // exam can be attended anytime other than specified or not
  "strict": validators.ValidateBoolean,
  "max": validators.ValidateOrIgnoreNumber,
  // add group
  "addressid": validators.ValidateAddress,
  "gender": validators.ValidateGender,
  "schedule": validators.ValidateSchedule,
  // list groups
  groupid: validators.ValidateNumber,
  "ig_grades": validators.ValidateOrIgnoreGrades,
  // log exam
  "mark": validators.ValidateNumber,
  "attendant": validators.ValidateBoolean,
  // list students
  "ig_groups": validators.ValidateOrIgnoreNumberArray,
  "students_limit": validators.ValidateOrGiveLimit50,
  // unlink student
  "linkid": validators.ValidateNumber,
  // search
  "search_limit": validators.ValidateOrGiveLimit5,
  // initialize class
  "date": validators.ValidateDate,
  // log class
  ig_attendant: validators.ValidateOrIgnoreBoolean,
  homework: validators.ValidateOrIgnoreHomework,
  quiz: validators.ValidateOrIgnoreQuiz,
  classid: validators.ValidateNumber,
  ig_groupid: validators.ValidateOrIgnoreNumber,
  // clear log
  logtype: validators.ValidateLogType,
  key: (key) => {
    if (key == 'j0FHC4CwPS4I2cPWYu0JcDLKQw2vzMY8MQbZrPypUGzSaOjjWu1yOtc2zlTxoQFj1DmdFhWYBlqyxTHep33MLiDeqt82Wgcp1wksA055xoKOhRSo5XSnCltaqIkZg2pwiro8prNtQTOKKOL2H2ES0gE3gyRHgzmjhkxK9vR4gDZTXBnrxbHWhnKYT8sf3IstapQNQeJkXBDkgUwuulnU6rlG8ZtaaCnyERlpIc6uazndhngSuFcIlc9k9uFilRA') return true;
    else return false;
  },
  // list students
  fulllist: validators.ValidateOrIgnoreBoolean,
  // add & edit exam
  redline: validators.ValidateNumber,
  ig_redline: validators.ValidateOrIgnoreNumber,
  ig_name: validators.ValidateOrIgnoreString,
  ig_max: validators.ValidateOrIgnoreNumber,
  // log exam
  ig_mark: validators.ValidateOrIgnoreNumber,
  // list exams
  getdata: validators.ValidateOrIgnoreBoolean,
  // add item
  price: validators.ValidateNumber,
  itemCategory: validators.ValidateItemCategory,
  // set payment
  itemid: validators.ValidateNumber,
  ig_discount: validators.ValidateOrIgnoreNumber,
  ig_price: validators.ValidateOrIgnoreNumber,
  ig_payedAmount: validators.ValidateOrIgnoreNumber,
  ig_addedClass: validators.ValidateOrIgnoreBoolean,
  // request parent token
  code: validators.ValidateString,
  // get info for parent
  parenttoken: validators.ValidateParentToken,
  datePeriod: validators.ValidateOrIgnoreDatePeriod,
  // fetch logs for parent
  teacher: validators.ValidateNumber,
  // create group
  ig_schedule: validators.ValidateOrIgnoreSchedule,
  // links classes
  classnum: validators.ValidateNumber,
  groupday: validators.ValidateDay,
  // init class
  ig_classnum: validators.ValidateOrIgnoreNumber,
  // brief log
  ig_classid: validators.ValidateOrIgnoreNumber,
  ig_examid: validators.ValidateOrIgnoreNumber,
  // adb
  serial: validators.ValidateString,
  recipient: validators.ValidateString,
  message: validators.ValidateString,
  // update name and subjects
  subjects: data.validators.ValidateSubjects,
  // fetch contacts with classes, exams, logs
  ig_getcontacts: validators.ValidateOrIgnoreBoolean,
  // add expense
  payedAmount: validators.ValidateNumber,
  // set expense
  _id: validators.ValidateString,
}

// REG CALLS

var userDocDefault = {
  "userDoc.username": 1,
  ['userDoc.' + data.identifier]: 1,
  ['userDoc.' + data.foreignIdentifier]: 1,
  ['userDoc.' + data.studentForeignIdentifier]: 1,
  ['userDoc.' + data.teacherForeignIdentifier]: 1,
  "userDoc.usertype": 1
};
var userDocRestricts = {
  ChangePassword: lib.OverlayArray(userDocDefault, {
    "userDoc.password": 1,
  }),
  CheckTimetableCollision: lib.OverlayArray(userDocDefault, {
    "userDoc.grade": 1
  }),
  GetBio: lib.OverlayArray(userDocDefault, {
    "userDoc.bio": 1
  }),
  GetDefaultPhonecode: lib.OverlayArray(userDocDefault, {
    "userDoc.defaults.phonecode": 1
  }),
  GetSuperTtDefaults: lib.OverlayArray(userDocDefault, {
    "userDoc.grades": 1,
    "userDoc.defaults": 1
  }),
  ListGroups: lib.OverlayArray(userDocDefault, {
    "userDoc.grades": 1
  }),
  GetGrades: lib.OverlayArray(userDocDefault, {
    "userDoc.grades": 1
  })
};

/* put the "token" first 'cause if it's validator returns false, then none of the other paramters
matter and to take it easy on the processor for the validators that require other paramters
*/
// ADMIN
registerApiCall("/up", [], null, (args, callback) => {
  callback(null, stats.OK)
})

registerApiCall("/admin/check", ["key"], null, (args, callback) => {
  callback(null, stats.OK);
});
registerApiCall("/admin/teachers/list", ["key"], null, data.ListTeachers);
registerApiCall("/admin/teachers/register", ["username", "name", "subjects", "key"], null, data.RegisterTeacher);

registerApiCall("/alive", ["token"], userDocDefault, data.isAlive);
//TODO make it 2 seconds : 2000ms
registerApiCall("/authorize", ["login", "password", "model", "device"], null, data.Authorize, false, false, 0);
registerApiCall("/password/change", ["password", "oldpassword", "token"], null, data.ChangePassword);
registerApiCall("/search/students", ["token", "name", "search_limit", "startid", "ig_grades"], null, data.SearchStudents);

registerApiCall("/phones/set", ["token", "targetuser", "phonecode", "number", "phonetype", "delete"], userDocDefault, data.SetPhone);
registerApiCall("/phones/edit", ["token", "targetuser", "id", "new_phonecode", "new_number", "new_phonetype"], userDocDefault, data.EditPhone);
registerApiCall("/phones/list", ["token", "targetuser", "startid", "limit", "ig_ids"], null, data.GetPhones);
registerApiCall("/phones/remove", ["token", "targetuser", "ids"], null, data.RemovePhones);

registerApiCall("/addresses/add", ["token", "name", "phones", "coordinates", "address", "addresstype"], userDocDefault, data.AddAddress);
registerApiCall("/addresses/get", ["token", "startid", "limit", "ig_ids"], null, data.GetAddresses);
registerApiCall("/addresses/remove", ["token", "ids"], null, data.RemoveAddress);
//registerApiCall("/timetables/collision", ["token", "ttcoll_usernames", "ttcoll_ids", "start_time", "days", "period"], true, data.CheckTimetableCollision);
registerApiCall("/bids/list", ["token", "targetuser"], userDocDefault, data.GetBids);
registerApiCall("/files/prepare", ["token", "checksum", "size", "extension", "permissions"], userDocDefault, data.PrepareUpload);
registerApiCall("/files/continue", ["token", "checksum", "size", "id"], userDocDefault, data.ContinueUpload);
registerApiCall("/files/upload", ["token", "checksum", "size", "id", "bytes_range"], userDocDefault, data.Upload, true);
registerApiCall("/files/download", ["token", "id", "abs_bytes_range"], userDocDefault, data.Download, false, true);
registerApiCall("/files/delete", ["token", "ids"], userDocDefault, data.DeleteFiles);
registerApiCall("/files/getinfo", ["token", "ids"], userDocDefault, data.GetFilesInfo);

registerApiCall("/parent/request", ["code"], null, data.RequestParentToken);
registerApiCall("/parent/info", ["parenttoken"], null, data.GetInfoForParent);
registerApiCall("/parent/fetchlogs", ["parenttoken", "grade", "datePeriod", "teacher"], null, data.FetchLogsForParent);
//TEACHER
registerApiCall("/teacher/bid", ["token", "title", "gender", "addresses", "grade", "prices", "subjects", "timetables"], userDocDefault, data.Bid);

/*registerApiCall("/teacher/subjects/get", ["token", "targetuser"], true, data.GetSubjects);
registerApiCall("/teacher/subjects/add", ["token", "subjects"], true, data.AddSubjects);
registerApiCall("/teacher/subjects/remove", ["token", "subjects"], true, data.RemoveSubjects);*/

//TODO notify students
registerApiCall("/teacher/exams/add", ["token", /*"times"*/ "name", "redline", "grade", "max", /*"curriculum", "strict", "notes"*/ ], userDocDefault, data.AddExam);
registerApiCall("/teacher/exams/get", ["token", /*"startid", "limit", "ig_ids"*/ "ig_grades", "getdata"], userDocDefault, data.GetExams);
registerApiCall("/teacher/exams/getone", ["token", "id"], userDocDefault, data.GetExam);
registerApiCall("/teacher/exams/edit", ["token", "id", "ig_name", "ig_redline", "ig_max"], userDocDefault, data.EditExam);
registerApiCall("/teacher/exams/remove", ["token", "id"], userDocDefault, data.RemoveExam);
registerApiCall("/teacher/exams/fetchlogs", ["token", "id", "grade", "ig_getcontacts"], userDocDefault, data.FetchExamLogs);
registerApiCall("/teacher/exams/log", ["token", "id", "student", "ig_attendant", "ig_mark"], userDocDefault, data.LogExam);

registerApiCall("/teacher/posts/post", ["token", "text", "media_ids"], userDocDefault, data.Post);
registerApiCall("/teacher/posts/edit", ["token", "id", "text", "new_media_ids"], userDocDefault, data.EditPost);
registerApiCall("/teacher/posts/remove", ["token", "id"], userDocDefault, data.RemovePost);

// adb
registerApiCall("/adb/devices/list", ["token"], userDocDefault, data.ListDevices);
registerApiCall("/adb/sms/send", ["token", "serial", "recipient", "message"], userDocDefault, data.SendSMS);

// profile
registerApiCall("/profile/updatens", ["token", "fullname", "subjects"], userDocDefault, data.UpdateNameAndSubjects);
registerApiCall("/profile/get", ["token"], userDocDefault, data.GetNameAndSubjects);

//registerApiCall("/teacher/grades/edit", ["token", "grades"], true, data.EditGrades);
registerApiCall("/teacher/grades/get", ["token", "targetuser"], userDocRestricts.GetGrades, data.GetGrades);
registerApiCall("/teacher/grades/months", ["token", "grade"], userDocDefault, data.ListGradeMonths);

registerApiCall("/teacher/defaults/supertt/set", ["token", "days", "duration", "whours", "break", "fbreak"], userDocDefault, data.SetSuperTTDefaults);
registerApiCall("/teacher/defaults/supertt/get", ["token"], userDocRestricts.GetSuperTtDefaults, data.GetSuperTTDefaults);

registerApiCall("/teacher/defaults/phonecode/set", ["token", "phonecode"], userDocDefault, data.SetDefaultPhoneCode);
registerApiCall("/teacher/defaults/phonecode/get", ["token"], userDocRestricts.GetDefaultPhonecode, data.GetDefaultPhoneCode);

registerApiCall("/teacher/students/register", ["token", "fullname" /*, "username"*/ ], userDocDefault, data.RegisterStudent);
registerApiCall("/teacher/students/rename", ["token", "fullname", 'targetuser'], userDocDefault, data.RenameStudent);
registerApiCall("/teacher/students/link", ["token", "student", "grade", "group"], userDocDefault, data.LinkStudent);
registerApiCall("/teacher/students/edit", ["token", "id", "grade", "group"], userDocDefault, data.EditLink);
registerApiCall("/teacher/students/unlink", ["token", "linkid"], userDocDefault, data.UnlinkStudent);
registerApiCall("/teacher/students/list", ["token", "fulllist", "ig_grades", "ig_groups", "startid", "students_limit", "ig_getcontacts"], userDocDefault, data.ListStudents);
registerApiCall("/teacher/students/qrlist", ["token", "ig_grades", "ig_groups"], userDocDefault, data.QRListStudents);
registerApiCall("/teacher/students/count", ["token", "ig_grades", "ig_groups", "startid"], userDocDefault, data.CountStudents);
registerApiCall("/teacher/students/get", ["token", "targetuser"], userDocDefault, data.GetStudent);
registerApiCall("/teacher/secretaries/create", ["token", "name", "username"], userDocDefault, data.CreateSecretary);
/*registerApiCall("/teacher/secretaries/list", ["token", "ig_grades"], userDocRestricts.ListGroups, data.ListGroups);
registerApiCall("/teacher/secretaries/remove", ["token", "groupid"], userDocDefault, data.RemoveGroup);*/

registerApiCall("/teacher/items/add", ["token", "name", "grade", "price", "itemCategory"], userDocDefault, data.AddItem);
registerApiCall("/teacher/items/get", ["token", "itemid"], userDocDefault, data.GetItem);
registerApiCall("/teacher/items/remove", ["token", "itemid"], userDocDefault, data.RemoveItem);
registerApiCall("/teacher/items/list", ["token", "grade"], userDocDefault, data.ListItems);
registerApiCall("/teacher/items/listcategories", ["token", "grade"], userDocDefault, data.ListCategories);
registerApiCall("/teacher/items/applyprice", ["token", "itemid", "price"], userDocDefault, data.ApplyPriceChange);

registerApiCall("/teacher/payments/set", ["token", "student", "itemid", "ig_discount", "ig_payedAmount"], userDocDefault, data.SetPayment);
registerApiCall("/teacher/payments/list", ["token", "date"], userDocDefault, data.ListPayments);
registerApiCall("/teacher/paylogs/add", ["token", "name", "payedAmount", "date"], userDocDefault, data.AddPayLog);
registerApiCall("/teacher/paylogs/set", ["token", "_id", "payedAmount"], userDocDefault, data.SetPayLog);
registerApiCall("/teacher/payments/fetchlogs", ["token", "itemid", "grade"], userDocDefault, data.FetchPaymentLogs);

registerApiCall("/teacher/groups/create", ["token", "name", "grade", /*"subjects", "addressid", "gender"*/ "schedule"], userDocDefault, data.CreateGroup);
registerApiCall("/teacher/groups/list", ["token", "ig_grades"], userDocRestricts.ListGroups, data.ListGroups);
registerApiCall("/teacher/groups/edit", ["token", "id", "ig_name", "ig_schedule"], userDocDefault, data.EditGroup);
registerApiCall("/teacher/groups/get", ["token", "id"], userDocDefault, data.GetGroup);
registerApiCall("/teacher/groups/distinct", ["token", "ig_grades"], userDocRestricts.ListGroups, data.DistinctGroups);
registerApiCall("/teacher/groups/remove", ["token", "groupid"], userDocDefault, data.RemoveGroup);

registerApiCall("/teacher/classes/init", ["token", "grade", "date", "ig_addedClass", "ig_classnum"], userDocDefault, data.InitializeClass);
registerApiCall("/teacher/classes/list", ["token", "grade"], userDocDefault, data.ListClasses);
registerApiCall("/teacher/classes/get", ["token", "classid"], userDocDefault, data.GetClass);
registerApiCall("/teacher/classes/delete", ["token", "classid"], userDocDefault, data.DeleteClass);
registerApiCall("/teacher/classes/fetchlogs", ["token", "classid", "grade", "ig_getcontacts"], userDocDefault, data.FetchClassLogs);
registerApiCall("/teacher/classes/log", ["token", "ig_groupid", "student", "classid", "ig_attendant", "homework", "quiz"], userDocDefault, data.AddClassLog);

registerApiCall("/teacher/classes/groups/links", ["token", "grade"], userDocDefault, data.ListGroupClassesLinks);
registerApiCall("/teacher/classes/groups/link", ["token", "grade", "classnum", "groupid", "groupday"], userDocDefault, data.LinkGroupClasses);
registerApiCall("/teacher/classes/groups/remove", ["token", "groupid", "groupday", "grade"], userDocDefault, data.RemoveGroupClass);
registerApiCall("/teacher/classes/refresh", ["token"], userDocDefault, data.RefreshMissingClasses);
registerApiCall("/teacher/classes/countlinked", ["token", "grade"], userDocDefault, data.CountGroupsLinks);

registerApiCall("/teacher/defaults/startdates/set", ["token", "grade", "date"], userDocDefault, data.SetDefaultStartDate);
registerApiCall("/teacher/defaults/startdates/get", ["token"], userDocDefault, data.GetDefaultStartDates);

registerApiCall("/teacher/logs/fetch", ["token", "targetuser", "grade", "datePeriod"], userDocDefault, data.FetchLogs);
registerApiCall("/teacher/logs/brief", ["token", "targetuser", "ig_examid", "ig_classid"], userDocDefault, data.BriefLog);
registerApiCall("/teacher/logs/clear", ["token", "targetuser", "logtype"], userDocDefault, data.ClearLog);
//STUDENT
registerApiCall("/student/grade/edit", ["token", "grade"], userDocDefault, data.EditGrade);
registerApiCall("/student/grade/get", ["token", "targetuser"], userDocDefault, data.GetGrade);



// EREG CALLS

function registerApiCall(path, args, getdata, dataFunction, expectedStream, outputs, timeout) {
  if (!timeout) timeout = 0;
  router.post(path, function (req, res) {
    var typicalCallback = function (err, stat, result, stream) {
      if (err) return Error(res, err);
      if (outputs) {
        if (!stream) return sendStat(res, stats.Error);
        var out_json;
        if (typeof result != 'undefined') out_json = finishAPIRequest({
          stat: stat,
          result: result
        });
        else out_json = finishAPIRequest({
          stat: stat
        });
        res.setHeader('Content-Type', "application/octet-stream");
        out_json = Buffer.from(out_json);
        res.setHeader('jsonlength', out_json.length);
        setTimeout(() => {
          res.write(out_json, 'binary');
          streamRes(res, stream, function (err) {
            if (err) next(err);
            else {
              res.end();
            }
          });
        }, timeout);
      } else {
        setTimeout(() => {
          sendStat(res, stat, result);
        }, timeout);
      }
    };
    try {
      var dataArguments = {};
      // only read body when args are specified
      var jsonlength = req.headers.jsonlength;
      if (expectedStream && jsonlength && !validators.ValidateNumberString(jsonlength) || (expectedStream && !jsonlength))
        return sendStat(res, stats.InvalidHeaders, "jsonlength");
      var json;
      var buffer;
      if (args.length > 0) {
        var parsed = readAPIRequest(req.body, jsonlength);
        if (parsed.error) return sendStat(res, stats.InvalidJSON);
        json = parsed.json;
        buffer = parsed.buffer;
      }
      // return if no data is sent
      if (!buffer && expectedStream) return sendStat(res, stats.EmptyData);

      // loop inside a function to support async validators
      var index = 0;
      var length = args.length;
      var loop = () => {
        // stop loop if done and call database function
        if (index >= length) {
          if (data._loaded)
            try {
              dataFunction(dataArguments, typicalCallback, buffer);
            } catch (e) {
              throw {
                err: e,
                res: res
              }
            }
          else return sendStat(res, stats.NotReady);
          return;
        }
        // key / arg
        var key = args[index];
        // request value
        var value = json[key];
        // validator
        var dev = inputvalidators[key];
        if (!dev) return InvalidData(res, key);
        if (dev.requires) {
          if (!dev.args) dev.args = {};
          for (var i = 0; i < dev.requires.length; i++) {
            var requirement = dev.requires[i];
            if (!dataArguments[requirement]) {
              if (index == length - 1)
                return InvalidData(res, requirement);
              else {
                args.push(args.splice(0, 1)[0]);
                // don't increment the index
                return loop();
              }
            } else {
              dev.args[requirement] = dataArguments[requirement];
            }
          }
        }
        var processResult = function (result) {
          if (result || typeof result == "number") {
            if (dev.input) dataArguments[dev.inputName] = result;
            if (!dev.replacer) dataArguments[key] = value;
            index++;
            return loop();
          } else if (result === undefined) {
            index++;
            return loop();
          } else {
            if (key == "token") InvalidToken(res);
            else return InvalidData(res, key);
          };
        }
        if (key == "token") {
          dev.getdata = getdata
        }
        if (dev.async) {
          if (dev.requires) {
            dev.args.value = value;
            dev(dev.args, function (result) {
              processResult(result);
            });
          } else {
            dev(value, function (result) {
              processResult(result);
            });
          }
        } else {
          if (dev.requires) {
            dev.args.value = value;
            var result;
            if (dev.responseCallback) result = dev(dev.args, typicalCallback);
            else result = dev(dev.args);
            processResult(result, args);
          } else {
            var result;
            if (dev.responseCallback) result = dev(value, typicalCallback);
            else result = dev(value);
            processResult(result, args);
          }
        }
      }
      loop();
    } catch (exception) {
      try {
        Error(res, exception);
      } catch (e) {
        SaveError(e);
      }
    }
  });
}

module.exports = router;