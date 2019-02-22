const lib = require('./library');
var defParam = lib.defParam;
var data;
var stats;
module.exports = function (datajs) {
  data = datajs;
  stats = data._stats;
  return lib.OverlayArray(lib.validators, initialize());
}

function initialize() {
  function ValidateOrGiveSync(value) {
    var dev = arguments.callee.validator;
    var give = arguments.callee.give;
    if (value) {
      if (!dev(value)) return false;
      else return value;
    } else {
      return give;
    }
  };

  function ValidateOrIgnore(value, callback) {
    var dev = arguments.callee.validator;
    if (value) {
      dev(value, callback)
    } else {
      callback(undefined);
    }
  };

  function ValidateOrIgnoreRequires(value, callback) {
    var dev = arguments.callee.validator;
    if (value.value) {
      dev(value, callback)
    } else {
      callback(undefined);
    }
  };

  function ValidateOrIgnoreSync(value) {
    var dev = arguments.callee.validator;
    if (value != undefined) {
      if (!dev(value)) return false;
      else return value || true; /* for booleans */
    } else {
      return undefined;
    }
  };

  var ValidateToken = data.validators.ValidateToken;
  ValidateToken.input = true;
  ValidateToken.inputName = "userDoc";
  ValidateToken.async = true;
  ValidateToken.getdata = {};

  var ValidateOrGiveDate = ValidateOrGiveSync.clone();
  ValidateOrGiveDate.input = true;
  ValidateOrGiveDate.inputName = "date";
  ValidateOrGiveDate.replacer = true;
  ValidateOrGiveDate.validator = lib.validators.ValidateDate;
  ValidateOrGiveDate.give = lib.SimpleDate(new Date());

  var ValidateOrGiveStartID = ValidateOrGiveSync.clone();
  ValidateOrGiveStartID.input = true;
  ValidateOrGiveStartID.inputName = "startid";
  ValidateOrGiveStartID.replacer = true;
  ValidateOrGiveStartID.validator = lib.validators.ValidateNumber;
  // to use $gte = greater than or equals
  ValidateOrGiveStartID.give = 0;

  var ValidateOrGiveLimit = ValidateOrGiveSync.clone();
  ValidateOrGiveLimit.input = true;
  ValidateOrGiveLimit.inputName = "limit";
  ValidateOrGiveLimit.replacer = true;
  ValidateOrGiveLimit.validator = lib.validators.ValidateNumber;
  ValidateOrGiveLimit.give = 10;

  var ValidateOrGiveLimit = ValidateOrGiveSync.clone();
  ValidateOrGiveLimit.input = true;
  ValidateOrGiveLimit.inputName = "limit";
  ValidateOrGiveLimit.replacer = true;
  ValidateOrGiveLimit.validator = lib.validators.ValidateNumber;
  ValidateOrGiveLimit.give = 10;

  var ValidateOrGiveSkip = ValidateOrGiveSync.clone();
  ValidateOrGiveSkip.input = true;
  ValidateOrGiveSkip.inputName = "skip";
  ValidateOrGiveSkip.replacer = true;
  ValidateOrGiveSkip.validator = lib.validators.ValidateNumber;
  ValidateOrGiveSkip.give = 0;

  var ValidateOrGiveLimit5 = ValidateOrGiveSync.clone();
  ValidateOrGiveLimit5.input = true;
  ValidateOrGiveLimit5.inputName = "limit";
  ValidateOrGiveLimit5.replacer = true;
  ValidateOrGiveLimit5.validator = lib.validators.ValidateNumber;
  ValidateOrGiveLimit5.give = 5;

  var ValidateOrGiveLimit50 = ValidateOrGiveSync.clone();
  ValidateOrGiveLimit50.input = true;
  ValidateOrGiveLimit50.inputName = "limit";
  ValidateOrGiveLimit50.replacer = true;
  ValidateOrGiveLimit50.validator = lib.validators.ValidateNumber;
  ValidateOrGiveLimit50.give = 50;

  var ValidatePhoneType = lib.validators.ValidateFromValues.clone();
  ValidatePhoneType.values = ["mobile", "parent1", "parent2", "home"];

  var ValidateItemCategory = lib.validators.ValidateFromValues.clone();
  ValidateItemCategory.values = ["paper", "book", "revision", "subscription", "course", "addedClasses"];

  var ValidateLogType = lib.validators.ValidateFromValues.clone();
  ValidateLogType.values = ["class", "exam"];

  var ValidateOrIgnorePhoneType = ValidateOrIgnoreSync.clone();
  ValidateOrIgnorePhoneType.validator = ValidatePhoneType;

  var ValidateDegreeType = lib.validators.ValidateFromValues.clone();
  ValidateDegreeType.values = ["marks", "general"];

  var ValidateAddressType = lib.validators.ValidateFromValues.clone();
  ValidateAddressType.values = ["home", "center"];

  var ValidateGender = lib.validators.ValidateFromValues.clone();
  ValidateGender.values = ["male", "maledominant", "female", "femaledominant", "mixed"];

  var ValidateDevice = lib.validators.ValidateFromValues.clone();
  ValidateDevice.values = ["web", "android", "ios", "desktop"];

  var ValidateDisplayName = lib.validators.ValidateString.clone();
  ValidateDisplayName.limit = 24;

  var ValidateParentToken = (str) => {
    if (lib.validators.ValidateString(str)) {
      return str.length == 64;
    } else return false;
  }

  var ValidateHomework = (homework) => {
    if (!homework) return false;
    if (!homework.type) return false;
    if (homework.type == "general") {
      if (homework.option == "incomplete" || homework.option == "complete") return true;
    }
    if (homework.type == "marks") {
      if (typeof homework.mark == 'number' && typeof homework.max == 'number' && homework.mark <= homework.max) return true;
    }
    return false;
  }

  var ValidateOrIgnoreHomework = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreHomework.validator = ValidateHomework;

  var ValidateQuiz = (quiz) => {
    if (!quiz) return false;
    if (!quiz.type) return false;
    if (quiz.type == "general") {
      if (quiz.option == "done" || quiz.option == "absent" || quiz.option == "right" || quiz.option == "wrong") return true;
    }
    if (quiz.type == "marks") {
      if (typeof quiz.mark == 'number' && typeof quiz.max == 'number' && quiz.mark <= quiz.max) return true;
    }
    return false;
  }

  var ValidateOrIgnoreQuiz = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreQuiz.validator = ValidateQuiz;

  var ValidateUsername = function (value) {
    if (!value) return false;
    var val = lib.validators.ValidateString.clone();
    val.limit = 24;
    if (val(value)) {
      var chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
      for (var i = 0; i < value.length; i++) {
        if (chars.indexOf(value[i]) < 0) return false;
      }
      return true;
    } else return false;
  }



  var ValidateOrIgnoreNumber = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreNumber.validator = lib.validators.ValidateNumber;

  var ValidateOrIgnoreNumberArray = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreNumberArray.validator = lib.validators.ValidateNumberArray;

  var ValidateOrIgnoreBoolean = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreBoolean.validator = lib.validators.ValidateBoolean;

  var ValidateOrIgnoreString = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreString.validator = lib.validators.ValidateString;

  var ValidateOrIgnoreStringArray = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreStringArray.validator = lib.validators.ValidateStringArray;

  var ValidateOrIgnorePhones = ValidateOrIgnoreRequires.clone();
  ValidateOrIgnorePhones.async = true;
  ValidateOrIgnorePhones.requires = ["userDoc"];
  ValidateOrIgnorePhones.args = {
    col: "phones",
    key: "id"
  };
  ValidateOrIgnorePhones.validator = data.validators.ValidateByIds;

  var ValidateOrIgnorePhoneCode = ValidateOrIgnoreSync.clone();
  ValidateOrIgnorePhoneCode.validator = data.ValidatePhoneCode.clone();

  var ValidateOrIgnoreNumberString = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreNumberString.validator = lib.validators.ValidateNumberString;

  var ValidateOrIgnorePhones = ValidateOrIgnoreRequires.clone();
  ValidateOrIgnorePhones.async = true;
  ValidateOrIgnorePhones.requires = ["userDoc"];
  ValidateOrIgnorePhones.args = {
    col: "phones",
    key: "id"
  };
  ValidateOrIgnorePhones.validator = data.validators.ValidateByIds;

  var ValidateOrIgnoreMediaIds = ValidateOrIgnoreRequires.clone();
  ValidateOrIgnoreMediaIds.async = true;
  ValidateOrIgnoreMediaIds.requires = ["userDoc"];
  ValidateOrIgnoreMediaIds.args = {
    col: "files",
    key: "id"
  };
  ValidateOrIgnoreMediaIds.validator = data.validators.ValidateByIds;

  var ValidateAddresses = data.validators.ValidateByIds.clone();
  ValidateAddresses.async = true;
  ValidateAddresses.requires = ["userDoc"];
  ValidateAddresses.args = {
    key: "id",
    col: "addresses",
    notbeEmpty: true
  };

  var ValidateAddress = data.validators.ValidateById.clone();
  ValidateAddress.async = true;
  ValidateAddress.requires = ["userDoc"];
  ValidateAddress.args = {
    key: "id",
    col: "addresses"
  };

  //TODO
  var ValidateBidEndDate = function (args) {
    //    if (args.bidtype == )
  }
  var ValidateOrIgnoreBidEndDate = ValidateOrIgnoreRequires.clone();
  ValidateOrIgnoreBidEndDate.async = true;
  ValidateOrIgnoreBidEndDate.requires = ["bidtype"];
  ValidateOrIgnoreBidEndDate.validator = ValidateBidEndDate;

  var ValidatePrices = function (prices) {
    if (lib.ArrayOrObject(prices) == 'array') {
      var ids = [];
      for (var i = 0; i < prices.length; i++) {
        var price = prices[i];
        // make sure that ids do not repeat
        if (ids.indexOf(price.id) > -1) {
          return false;
        } else ids.push(price.id);
        if (lib.validators.ValidateString(price.name) && lib.validators.ValidateNumber(price.id) && lib.validators.ValidateNumber(price.price) && lib.validators.ValidateBoolean(price.required)) {} else return false;
      }
      return true;
    } else return false;
  }

  var ValidateTimetables = function (tts) {
    if (lib.ArrayOrObject(tts) != "array") return false;
    if (tts.length <= 0) return false;
    for (var i = 0; i < tts.length; i++) {
      if (!lib.validators.ValidateNumberRange()(tts[i].start, 0, 1439) ||
        !lib.validators.ValidateNumberRange()(tts[i].end, 0, 1439) ||
        !lib.validators.ValidateNumberRange()(tts[i].day, 1, 7) ||
        !(tts[i].end >= tts[i].start) ||
        !lib.validators.ValidateNumber(tts[i].break) ||
        !lib.validators.ValidateNumber(tts[i].group) ||
        !data.lib.validators.ValidateGrade(tts[i].grade))
        return false
    }
    return tts;
  }
  ValidateTimetables.input = true;
  ValidateTimetables.replacer = true;
  ValidateTimetables.inputName = "timetables";

  var ValidateTimes = function (tts) {
    if (lib.ArrayOrObject(tts) != "array") return false;
    if (tts.length <= 0) return false;
    for (var i = 0; i < tts.length; i++) {
      if (!lib.validators.ValidateNumberRange()(tts[i].start, 0, 1439) ||
        !lib.validators.ValidateNumberRange()(tts[i].end, 0, 1439) ||
        !(tts[i].end >= tts[i].start) ||
        !lib.validators.ValidateDate(tts[i].day))
        return false;
    }
    return tts;
  }
  ValidateTimes.input = true;
  ValidateTimes.replacer = true;
  ValidateTimes.inputName = "times";

  var ValidateSchedule = function (schedule) {
    if (lib.ArrayOrObject(schedule) != "object") return false;
    if (schedule.length <= 0) return false;
    if (!schedule.days) return false;
    if (!schedule.time) return false;
    for (let i = 0; i < schedule.days.length; i++) {
      const element = schedule.days[i];
      if (!lib.validators.ValidateNumberRange()(parseInt(element), 0, 6)) return false;
    }
    if (!lib.validators.ValidateNumberRange()(schedule.time, 0, 1439)) return false;
    return true;
  }
  ValidateSchedule.input = true;

  var ValidateOrIgnoreSchedule = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreSchedule.validator = ValidateSchedule;

  var ValidateStartTime = lib.validators.ValidateNumberRange();
  ValidateStartTime.min = 0;
  ValidateStartTime.max = 1439;

  var ValidateTimePeriod = lib.validators.ValidateNumberRange();
  ValidateTimePeriod.min = 0;
  ValidateTimePeriod.max = 60 * 12;

  var ValidateOrIgnoreTimePeriod = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreTimePeriod.validator = ValidateTimePeriod;

  var ValidateTimeRange = function (period) {
    if (period.end > period.start && lib.validators.ValidateNumberRange()(period.start, 0, 1439) && lib.validators.ValidateNumberRange()(period.end, 0, 1440)) return true;
    return false;
  }
  var ValidateOrIgnoreTimeRange = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreTimeRange.validator = ValidateTimeRange;

  var ValidateOrIgnoreTimeRangeArray = lib.validators.ValidateArray.clone();
  ValidateOrIgnoreTimeRangeArray.val = ValidateTimeRange;

  var ValidateDay = lib.validators.ValidateNumberRange();
  ValidateDay.min = 0;
  ValidateDay.max = 6;

  function ValidateSMSProtocol(type) {
    const types = [
      'shellms',
      'legacy'
    ];
    if (types.indexOf(type) > -1) return true;
    return false;
  }

  var ValidateDays = lib.validators.ValidateArray.clone();
  ValidateDays.val = ValidateDay;

  var ValidateOrIgnoreDays = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreDays.validator = ValidateDays;

  var ValidateOrIgnoreDatePeriod = datePeriod => {
    if (!datePeriod) return undefined;
    if (!datePeriod.start || !datePeriod.end) return false;
    datePeriod = {
      start: lib.stripDate(new Date(datePeriod.start)),
      end: lib.stripDate(new Date(datePeriod.end), true)
    }
    if (datePeriod.start == 'Invalid Date') return false;
    if (datePeriod.end == 'Invalid Date') return false;
    return datePeriod;
  }
  ValidateOrIgnoreDatePeriod.input = true;
  ValidateOrIgnoreDatePeriod.inputName = "datePeriod";
  ValidateOrIgnoreDatePeriod.replacer = true;

  var ValidateAbsBytesRange = function (args) {
    var value;
    var size;
    // make sure value is not an argument
    if (args.value) {
      value = args.value;
      size = args.size;
    } else value = args;
    if (lib.ArrayOrObject(value) != 'object') return false;
    if (lib.validators.ValidateNumber(value.start) && lib.validators.ValidateNumber(value.end) && (value.end > value.start)) {
      if (size && !(value.end <= size)) return false;
      return true;
    }
    return false;
  }
  var ValidateBytesRange = ValidateAbsBytesRange.clone();
  ValidateBytesRange.requires = [
    "size"
  ];

  var ValidateExtension = function (extension) {
    var filetypes = Object.keys(extensions);
    var ft;
    for (var i = 0; i < filetypes.length; i++) {
      if (extensions[filetypes[i]].indexOf(extension) > -1) {
        ft = filetypes[i];
      }
    }
    return (ft == undefined) ? false : ft;
  }
  ValidateExtension.input = true;
  ValidateExtension.inputName = 'filetype';
  // keep it an object preparing for furture updates
  var ValidatePermissions = function (permissions, callback) {
    if (lib.ArrayOrObject(permissions) != 'object') return false;
    data.validators.ValidateUser(permissions.group, {
      "usertype": 1
    }, function (result) {
      if (result && result.usertype == 'teacher' && lib.validators.ValidateBoolean(permissions.public)) callback(true);
      else callback(false);
    })
  }
  ValidatePermissions.async = true;

  var ValidateGrades = lib.validators.ValidateArray.clone();
  ValidateGrades.val = data.validators.ValidateGrade;

  var ValidateOrIgnoreGrades = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreGrades.validator = ValidateGrades;

  var ValidateOrIgnoreGrade = ValidateOrIgnoreSync.clone();
  ValidateOrIgnoreGrade.validator = data.validators.ValidateGrade;

  function ValidateFullName(fullname, callback) {
    if (!fullname) return false;
    var nres = lib.NeutralizeName(fullname);
    if (nres) {
      var arr = nres.split(/ /g);
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (lib.DoublePartNameInit.indexOf(arr[i]) > -1) arr[i] = `${arr[i]} ${arr.splice(i + 1, 1)[0]}`;
      }
      obj.first = arr[0] ? arr[0] : '';
      obj.father = arr[1] ? arr[1] : '';
      /*obj.grand = arr.slice(2, arr.length - 1).join(' ');
      obj.last = arr[arr.length - 1];*/
      obj.grand = arr[2] ? arr[2] : '';
      obj.last = arr.slice(3, arr.length).join(' ');
      return obj;
    } else callback(null, stats.InvalidData, {
      "key": "fullname"
    });
  }
  ValidateFullName.responseCallback = true;
  ValidateFullName.input = true;
  ValidateFullName.inputName = 'fullname';
  ValidateFullName.replacer = true;

  var ValidateGroup = data.validators.ValidateGroup.clone();
  ValidateGroup.async = true;
  ValidateGroup.requires = [
    "userDoc"
  ];

  var ValidateOrIgnoreGroup = ValidateOrIgnore.clone();
  ValidateOrIgnoreGroup.validator = data.validators.ValidateGroup;
  ValidateOrIgnoreGroup.async = true;
  ValidateOrIgnoreGroup.requires = [
    "userDoc"
  ];

  var ValidateGradings = (gradings) => {
    const type = lib.ArrayOrObject(gradings);
    if (type != 'array') return false;

    for (const grading of gradings) {
      if (!lib.validators.ValidateString(grading.name)) return false;
      if (!lib.validators.ValidateNumber(grading.percentage)) return false;
    }

    return true;
  }

  return {
    ValidateTimes: ValidateTimes,
    ValidateGroup: ValidateGroup,
    ValidateFullName: ValidateFullName,
    ValidateDisplayName: ValidateDisplayName,
    ValidateUsername: ValidateUsername,
    ValidateDevice: ValidateDevice,
    ValidateToken: ValidateToken,
    ValidateOrIgnorePhoneCode: ValidateOrIgnorePhoneCode,
    ValidateOrIgnoreNumber: ValidateOrIgnoreNumber,
    ValidateOrIgnoreNumberString: ValidateOrIgnoreNumberString,
    ValidateOrGiveStartID: ValidateOrGiveStartID,
    ValidateOrGiveLimit: ValidateOrGiveLimit,
    ValidateOrIgnoreNumberArray: ValidateOrIgnoreNumberArray,
    ValidateOrIgnoreString: ValidateOrIgnoreString,
    ValidateOrIgnorePhones: ValidateOrIgnorePhones,
    ValidateAddressType: ValidateAddressType,
    ValidatePrices: ValidatePrices,
    ValidateBidEndDate: ValidateBidEndDate,
    ValidateAddresses: ValidateAddresses,
    ValidateGender: ValidateGender,
    ValidateTimetables: ValidateTimetables,
    ValidateOrIgnoreStringArray: ValidateOrIgnoreStringArray,
    ValidateStartTime: ValidateStartTime,
    ValidateOrIgnoreDays: ValidateOrIgnoreDays,
    ValidateExtension: ValidateExtension,
    ValidatePermissions: ValidatePermissions,
    ValidateBytesRange: ValidateBytesRange,
    ValidateOrIgnoreMediaIds: ValidateOrIgnoreMediaIds,
    ValidateAbsBytesRange: ValidateAbsBytesRange,
    ValidateOrIgnoreTimeRange: ValidateOrIgnoreTimeRange,
    ValidateOrIgnoreTimePeriod: ValidateOrIgnoreTimePeriod,
    ValidateGrades: ValidateGrades,
    ValidateAddress: ValidateAddress,
    ValidateSchedule: ValidateSchedule,
    ValidateOrIgnoreGrades: ValidateOrIgnoreGrades,
    ValidateOrGiveLimit50: ValidateOrGiveLimit50,
    ValidateOrGiveLimit5: ValidateOrGiveLimit5,
    ValidateOrGiveSkip: ValidateOrGiveSkip,
    ValidatePhoneType: ValidatePhoneType,
    ValidateOrIgnorePhoneType: ValidateOrIgnorePhoneType,
    ValidateOrIgnoreGrade: ValidateOrIgnoreGrade,
    ValidateOrIgnoreGroup: ValidateOrIgnoreGroup,
    ValidateOrIgnoreHomework: ValidateOrIgnoreHomework,
    ValidateOrIgnoreQuiz: ValidateOrIgnoreQuiz,
    ValidateLogType: ValidateLogType,
    ValidateOrIgnoreBoolean: ValidateOrIgnoreBoolean,
    ValidateDegreeType: ValidateDegreeType,
    ValidateItemCategory: ValidateItemCategory,
    ValidateParentToken: ValidateParentToken,
    ValidateOrIgnoreDatePeriod: ValidateOrIgnoreDatePeriod,
    ValidateOrIgnoreSchedule: ValidateOrIgnoreSchedule,
    ValidateDay: ValidateDay,
    ValidateSMSProtocol: ValidateSMSProtocol,
    ValidateGradings: ValidateGradings,
  };
}