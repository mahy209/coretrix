var quizNames = {
  absent: 'لم يسمّع',
  done: 'سمّع',
  right: 'سمّع صحيح',
  wrong: 'سمّع خطأ',
  all: 'الكل',
  none: 'لا تعدله',
};

function prioritizeNumber(contacts, goFor = "parent") {
  let indexes = {}
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]
    if (contact.phonecode && contact.number) {
      indexes[contact.type] = contact.phonecode + contact.number;
    }
  }
  if (goFor == "parent") {
    return indexes.parent1 ? indexes.parent1 : indexes.parent2;
  }
  if (goFor == "student") {
    return indexes.mobile;
  }
}

function formatSignature(profile) {
  const teacher = profile.name;
  // const subjects = profile.subjects;
  return teacher;
}

function resetModals() {
  for (const modal of $('.modal')) {
    modal.scroll(0, 0);
  }
}

function formatPayClass(payment, price) {
  if (!payment) {
    payment = {};
  }
  if (!payment.payed) {
    payment.cardClass = 'red';
    payment.payClass = 'red-text darken-1';
    payment.payText = 'لم يدفعها';
  } else {
    var payedMoney = payment.payed + (payment.discount || 0);
    if (payedMoney > price) {
      payment.cardClass = 'purple';
      payment.payClass = 'green-text';
      payment.payText = 'دفع أكثر من سعرها و يتبقى له ' + (payedMoney - price) + ' جنيه';
    } else if (payedMoney < price) {
      payment.cardClass = 'purple';
      payment.payClass = 'purple-text';
      payment.payText = 'لم يدفع بالكامل متبقى ' + (price - payedMoney) + ' جنيه';
    } else if (payedMoney == price) {
      payment.cardClass = 'blue-grey';
      payment.payClass = 'blue-text';
      payment.payText = 'دفعها';
    }
  }
  return payment;
}

// const intro = 'نعلم سيادتكم بان الطالب';
const intro = 'الطالب';

function gradeMark(mark, max, gradings) {
  if (!gradings) return '';
  const percentage = parseInt((mark / max) * 100);
  for (const grading of gradings) {
    if (percentage >= grading.percentage) {
      gradingName = grading.name;
      return grading.name;
    }
  }
}

function formatExamReport(profile, log, max_mark, examName, nointro, grades_names, gradings) {
  const grade = grades_names[log.grade];
  if (!log.log) log.log = {};
  const student = log.firstname;
  const attendant = log.log.attendant;
  const mark = log.log.mark;
  const option_mark = mark ? (mark + '/' + max_mark) : 'لم يحضر';
  const option_grading = gradeMark(mark, max_mark, gradings);
  return `درجة اختبار ${examName} للطالب ${student} ${option_mark} ${attendant && option_grading ? `(${option_grading}) ` : ''}` + (nointro ? '' : formatSignature(profile));
}

function formatClassReport(profile, log, options, classDay, nointro, grades_names) {
  const grade = grades_names[log.grade];
  if (!log.log) log.log = {};
  const student = log.firstname;
  const homework = log.log.homework;
  const quiz = log.log.quiz;
  const attendant = log.log.attendant;
  let option_attendant = attendant ? 'حضر' : 'لم يحضر';
  let option_homework = (homework ? (homework.type == 'marks' ? ' الواجب' + homework.mark + '/' + homework.max :
    (homework.option == 'incomplete' ? 'الواجب غير مكتمل' : 'الواجب كامل')) : '');
  let option_quiz = (quiz ? (quiz.type == 'marks' ? ' التسميع' + quiz.mark + '/' + quiz.max : (quizNames[quiz.option])) : '');
  let options_string = '';
  options_string =
    (options.attendant ? option_attendant : '') +
    (options.homework && option_homework ? ' و' + option_homework : '') +
    (options.quiz && option_quiz ? ' و' + option_quiz : '');
  return ((nointro ? '' : `${intro} ${student} `) + `${options_string}` + (nointro ? '' : ` - ${grade} ${formatSignature(profile)}`)).replace('  ', ' ').trim();
}

function changeLogger(elementName) {
  if (!console) {
    console = {}
  }
  var old = console.log
  var logger = document.getElementById(elementName)
  console.log = function (message) {
    if (typeof message == 'object') {
      logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />'
    } else {
      logger.innerHTML += message + '<br />'
    }
  }
  $(`#${elementName}`).bind('DOMNodeInserted', () => {
    document.getElementById(elementName).scrollTop = document.getElementById(elementName).scrollHeight
  })
  $(`#${elementName}`).dblclick(() => {
    document.getElementById(elementName).innerHTML = ''
  })
}

function setCookie(name, value) {
  Cookies.set(name, value, {
    path: '/'
  }, {
    expires: 9999
  })
}

const phonecodes = {
  '': {
    'english': 'Hotline',
    'arabic': 'خط ساخن'
  },
  '010': {
    'english': 'Vodafone',
    'arabic': 'فودافون'
  },
  '011': {
    'english': 'Etisalat',
    'arabic': 'إتصالات'
  },
  '012': {
    'english': 'Orange',
    'arabic': 'أورانج'
  },
  '02': {
    'english': 'Cairo',
    'arabic': 'القاهرة'
  },
  '03': {
    'english': 'Alexandria',
    'arabic': 'الأسكندرية'
  },
  '013': {
    'english': 'Qalyubia',
    'arabic': 'القليوبية'
  },
  '015': {
    'english': '10th of Ramadan',
    'arabic': 'العاشر من رمضان'
  },
  '040': {
    'english': 'Gharbia',
    'arabic': 'الغربية'
  },
  '045': {
    'english': 'Beheira',
    'arabic': 'البحيرة'
  },
  '046': {
    'english': 'Matruh',
    'arabic': 'مرسى مطروح'
  },
  '047': {
    'english': 'Kafr El-Sheikh',
    'arabic': 'كفر الشيخ'
  },
  '048': {
    'english': 'Monufia',
    'arabic': 'المنوفية'
  },
  '050': {
    'english': 'Dakahlia',
    'arabic': 'الدقهلية'
  },
  '055': {
    'english': 'Sharqia',
    'arabic': 'الشرقية'
  },
  '057': {
    'english': 'Damietta',
    'arabic': 'دمياط'
  },
  '062': {
    'english': 'Suez',
    'arabic': 'السويس'
  },
  '064': {
    'english': 'Ismailia',
    'arabic': 'الإسماعيلية'
  },
  '065': {
    'english': 'Red Sea',
    'arabic': 'البحر الأحمر'
  },
  '066': {
    'english': 'Port Said',
    'arabic': 'بورسعيد'
  },
  '068': {
    'english': 'North Sinai',
    'arabic': 'شمال سيناء'
  },
  '069': {
    'english': 'South Sinai',
    'arabic': 'جنوب سيناء'
  },
  '082': {
    'english': 'Beni Suef',
    'arabic': 'بنى سويف'
  },
  '084': {
    'english': 'Faiyum',
    'arabic': 'الفيوم'
  },
  '086': {
    'english': 'Minya',
    'arabic': 'المنيا'
  },
  '088': {
    'english': 'Asyut',
    'arabic': 'أسيوط'
  },
  '092': {
    'english': 'New Valley',
    'arabic': 'الوادى الجديد'
  },
  '093': {
    'english': 'Sohag',
    'arabic': 'سوهاج'
  },
  '095': {
    'english': 'Luxor',
    'arabic': 'الأقصر'
  },
  '096': {
    'english': 'Qena',
    'arabic': 'قنا'
  },
  '097': {
    'english': 'Aswan',
    'arabic': 'أسوان'
  }
}

const error = () => {
  Materialize.toast('حدث خطا ما فى النظام برجاء اعاده تحميل الموقع و المحاوله مره اخرى', 4000, 'gradient')
}

// 11 phone: (011)-5100-2051
// 7/10: line: (045)-3305-779
// 8/10: line: (02)-3567-0500
//
function parsePhoneNumber(number, def) {
  if (!number) return {
    phonecode: null,
    number: null
  }
  if (!def) def = '045'
  if (number.length > 11) return false
  let matches = number.match(/[0-9]+/)
  if (!matches) return false
  if (matches[0].length != number.length) return false
  else if (number.length == 11) {
    var code = number.substr(0, 3)
    if (phonecodes[code]) return {
      'phonecode': code,
      'number': number.substr(3, number.length)
    }
    else return false
  } else if (number[0] == '0') {
    if (number[1] == '2' || number[1] == '3') return {
      'phonecode': number.substr(0, 2),
      'number': number.substr(2, number.length)
    }
    else {
      var code = number.substr(0, 3)
      if (phonecodes[code]) return {
        'phonecode': code,
        'number': number.substr(3, number.length)
      }
    }
  } else if (number.length > 8) return false
  else return {
    'phonecode': def,
    'number': number
  }
}

var gradients = {
  warm: 'gradient-orange',
  error: 'gradient-red',
  green: 'gradient-green',
  info: 'gradient'
}

function toast(text, cls, time) {
  Materialize.toast(text, time * 1000 || 4000, cls || gradients.info)
}

var months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function simpleDate(date) {
  date = new Date(date)
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
}

function gradeMonth(grademonth) {
  return `${months[grademonth.month]} ${grademonth.year}`
}

function defaultStat(stats, data, callback, error) {
  switch (data.stat) {
    case stats.InvalidToken:
      Cookies.remove('token')
      window.location.href = '/'
      break
    case stats.InvalidJSON:
    case stats.Error:
      error(data.stat, data.result)
      break
    case stats.OK:
    default:
      callback(data.stat, data.result)
  }
}

var doublePartNameInit = [
  'عبد',
  'ابو'
]

function countWords(str) {
  return 4
  var matches = str.split(' ')
  var ln = 0
  for (var i = 0; i < matches.length; i++) {
    if (doublePartNameInit.indexOf(matches[i]) > -1) i++
    ln += 1
  }
  return ln
}

var specials = [{
    regex: /منه الله/g,
    replacer: 'منه'
  },
  {
    regex: /عبدال/g,
    replacer: 'عبد ال'
  }
]
var regexes = [{
    regex: /ة/g,
    replacer: 'ه'
  },
  {
    regex: /ي /g,
    replacer: 'ى '
  },
  {
    // ّ  َ  ً  ُ  ٌ  ِ  ٍ  ْ  ـ
    regex: /[ًٌٍَُِّْـ]/g,
    replacer: ''
  },
  {
    regex: /[أآإ]/g,
    replacer: 'ا'
  },
  {
    regex: /[ﻵﻷ]/g,
    replacer: 'ﻻ'
  },
  {
    regex: /  +/g,
    replacer: ' '
  }
].concat(specials)

function neutralizeName(name, neutralizeOnly) {
  if (!name) return undefined
  if (name.match(/\n/g)) return {
    stat: 'lines'
  }
  if (countWords(name) < 4 && !neutralizeOnly) {
    return undefined
  }
  for (var i = 0; i < regexes.length; i++) {
    name = name.replace(regexes[i].regex, regexes[i].replacer)
  }
  return name
}

function ValidateOrient(orient) {
  var timePeriods = []
  switch (orient) {
    case 'stickfirst':
      timePeriods = [
        'first'
      ]
      break
    case 'sticklast':
      timePeriods = [
        'last'
      ]
      break
    case 'middleup':
      timePeriods = [
        'middlefirst'
      ]
      break
    case 'middledown':
      timePeriods = [
        'middlelast'
      ]
      break
    case 'divide':
      timePeriods = [
        'middlefirst',
        'middlelast'
      ]
      break
    case 'distribute':
    default:
      timePeriods = [
        'first',
        'last',
        'middlefirst',
        'middlelast'
      ]
  }
  return timePeriods
}
ValidateOrient.input = true
ValidateOrient.inputName = 'timePeriods'

function ValidateGradesSettings(settings, whours, duration, break_period) {
  try {
    if (!settings) return false
    // TODO add wdays
    var wdays = [
      1, 2, 3, 4, 5, 6
    ]
    var whours = whours.end - whours.start
    var duration = wdays.length * whours
    var breaks_total = 0
    var classes_count = 0
    var classes_duration = 0
    for (var key in settings) {
      var sets = settings[key]
      if (!sets.duration && !duration) {
        return 'duration'
      }
      var d = sets.duration || duration
      var classes_c = sets.groups_count * sets.classes_count
      classes_count += classes_c
      classes_duration += (d * classes_c)
      breaks_total += ((sets.break || break_period) * classes_c) || 0
    }
    // var x = (duration - classes_duration) / classes_count
    var breaks_allowed = (duration - classes_duration)
    var x = breaks_allowed / classes_count
    if (x >= 0) {
      // if classes are okay but breaks are not
      // Math.floor(x) is the maximum break
      if (breaks_total > breaks_allowed) {
        return {
          maxBreak: Math.floor(x),
          breaksTime: breaks_total
        }
      }
      return settings
    } else {
      // if classes are not okay without breaks
      // Math.abs(x)*classes_count = how much more time needed
      return {
        time: Math.ceil(Math.abs(x) * classes_count),
        breaksTime: breaks_total
      }
      return false
    }
  } catch (e) {
    return false
  }
}

// range: to be removed, ranges: to be remobed from
// only removes if the range is inside another.. don't try to match it with other functions !!!
function removeTimeRange(range, ranges, exists) {
  if (range.end <= range.start) {
    return false
  }
  if (!ranges) {
    return [{
      start: 0,
      end: range.start
    }, {
      start: range.end,
      end: 1440
    }]
  } else {
    var found = false
    // loop through ranges
    for (var i = 0; i < ranges.length; i++) {
      // current range
      var rn = ranges[i]
      if (rn.start <= range.start && rn.end >= range.end) {
        found = true
        if (rn.start == range.start && rn.end == range.end) {
          ranges.splice(i, 1)
          return ranges
        }
        if (rn.start != range.start) {
          ranges.splice(i, 1, {
            start: rn.start,
            end: range.start
          })
        } else {
          ranges.splice(i, 1, {
            start: range.end,
            end: rn.end
          })
          return ranges
        }
        if (rn.end != range.end) {
          ranges.splice(i + 1, 0, {
            start: range.end,
            end: rn.end
          })
        } else {
          ranges.splice(i, 1, {
            start: rn.start,
            end: range.start
          })
          return ranges
        }
        return ranges
      }
    }
    if (!found) {
      return false
    }
  }
}

function timeRangeExists(range, ranges, returnoptions) {
  if (range.end <= range.start) {
    return false
  }
  var options = []
  for (var i = 0; i < ranges.length; i++) {
    var rn = ranges[i]
    if ((rn.end - rn.start >= range.end - range.start) && returnoptions) options.push(rn)
    if (rn.start <= range.start && rn.end >= range.end) {
      if (returnoptions) return {
        type: 'match',
        result: rn
      }
      else return true
    }
  }
  if (returnoptions) return {
    type: 'options',
    result: options
  }
  else return false
}

function durationExists(ranges, duration) {
  for (var key in ranges) {
    if ((ranges[key].end - ranges[key].start) >= duration) return true
  }
}

function timeRangeCollision(rn1, rn2) {
  if (rn1.start <= rn2.start && rn2.start < rn1.end && rn1.end < rn2.end) {
    return {
      start: rn2.start,
      end: rn1.end
    }
  }
  if (rn1.end >= rn2.end && rn1.start < rn2.end && rn2.start < rn1.start) {
    return {
      start: rn1.start,
      end: rn2.end
    }
  }
  // rn1 is bigger
  if (rn1.start <= rn2.start && rn1.end >= rn2.end) {
    return rn2
  }
  // rn2 is bigger
  if (rn2.start <= rn1.start && rn2.end >= rn1.end) {
    return rn1
  }
  return false
}

function filterTimeRanges(ranges, period) {
  var returner = []
  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i]
    if (range.end - range.start >= period) returner.push(range)
  }
  return returner
}
// compares only first two arrays then replaces them with the collisions
function daysTimeRangesCollision(arr, filter) {
  if (arr.length <= 1) return arr[0]
  var collisions = []
  var base_ranges = arr[0]
  var comparing_ranges = arr[1]
  for (var br_i = 0; br_i < Object.keys(base_ranges).length; br_i++) {
    var base_range = base_ranges[br_i]
    for (var i = 0; i < comparing_ranges.length; i++) {
      var comparing_range = comparing_ranges[i]
      var collision = timeRangeCollision(base_range, comparing_range)
      if (collision) {
        collisions.push(collision)
      }
    }
  }
  arr.splice(0, 2, collisions)
  if (filter) collisions = filterTimeRanges(collisions, filter)
  return daysTimeRangesCollision(arr, filter)
}

function generatePatterns(classes_count, days_count) {
  var rate = days_count / classes_count
  var patterns = []
  for (var i = 1; i < days_count + 1; i++) {
    var arr = [i]
    for (var index = 1; index < classes_count; index++) {
      var newitem = arr[arr.length - 1] + rate
      if (newitem <= 6) {
        arr.push(newitem)
      } else break
    }
    if (arr.length == classes_count) patterns.push(arr)
  }
  return patterns
}
// place: first, middle, last
// TODO place bids from super timetable
// TODO solid <boolean>: preferer 5 o'clock over 5:30
function getRange(ranges, duration, place, break_period) {
  duration += break_period
  var middle
  var ret = (start, end) => {
    return {
      start: Math.floor(start),
      end: Math.floor(end),
      break: break_period
    }
  }
  switch (place) {
    case 'first':
      for (var i = 0; i < ranges.length; i++) {
        var rn = ranges[i]
        if (rn.end - rn.start >= duration) {
          return ret(rn.start, rn.start + duration)
        }
      }
      return undefined
    case 'middlefirst':
      middle = place
    case 'middlelast':
      middle = place
      break
    case 'last':
      for (var i = ranges.length - 1; i >= 0; i--) {
        var rn = ranges[i]
        if (rn.end - rn.start >= duration) {
          return ret(rn.end - duration, rn.end)
        }
      }
      return undefined
  }
  var start = ranges[0].start
  var end = ranges[ranges.length - 1].end
  start = start + (((end - start) / 2) - (duration / 2))
  end = start + duration
  var options = timeRangeExists({
    start: start,
    end: end
  }, ranges, true)
  if (options.type == 'options' && options.result.length <= 0) return undefined
  else {
    function formatOption(option) {
      switch (place) {
        case 'middlefirst':
          var base_start = option.end - duration
          if (base_start - option.start < duration) {
            return ret(option.start, option.start + duration)
          } else {
            return ret(base_start, option.end)
          }
          break
        case 'middlelast':
          return ret(option.start, option.start + duration)
          break
        default:

      }
    }
    if (options.type == 'match') return ret(start, end)
    else {
      if (middle == 'middlefirst') {
        for (var i = 0; i < options.result.length; i++) {
          var rn = options.result[i]
          if (rn.start > start) {
            // return the last valid range or the first one if no valid ranges are existant
            if (i != 0) return formatOption(options.result[i - 1])
            else return formatOption(rn)
          }
        }
      } else if (middle == 'middlelast') {
        options.result.reverse()
        for (var i = 0; i < options.result.length; i++) {
          var rn = options.result[i]
          if (rn.end < end) {
            // return the last valid range or the first one if no valid ranges are existant
            if (i != 0) return formatOption(options.result[i - 1])
            else return formatOption(rn)
          }
        }
      }
    }
  }
}
// TODO working hours can be array of time ranges
function generateTimetable(settings, grades, defaults, timePeriods) {
  // TODO var wdays = defaults.days
  var wdays = [
    1, 2, 3, 4, 5, 6
  ]
  var whours = defaults.whours
  var break_period = defaults.break || 0
  var duration = defaults.duration

  var tt = {}
  var coll = {}
  for (var i = 0; i < wdays.length; i++) {
    tt[wdays[i]] = []
    coll[wdays[i]] = [whours]
  }

  for (var g_i = 0; g_i < grades.length; g_i++) {
    var gradeid = grades[g_i]
    var sets = settings[gradeid]
    if (!sets.duration) sets.duration = duration
    if (!sets.break) sets.break = break_period
    // REG ACUTAL CODE
    // console.log("classes_count: ", sets.classes_count)
    var patterns = generatePatterns(sets.classes_count, 6)
    var timePeriodSelector = lib.next(0, timePeriods.length - 1)
    var patternSelector = lib.next(0, patterns.length - 1)
    // looop through groups
    for (var p_i = 0; p_i < sets.groups_count; p_i++) {
      var pattern = patterns[patternSelector()]
      var days = []
      // get days
      for (var i = 0; i < pattern.length; i++) {
        days.push(coll[pattern[i]])
      }
      var c_coll = daysTimeRangesCollision(days)

      function tps() {
        return timePeriods[timePeriodSelector()]
      }
      var t = tps()

      var cls = getRange(c_coll, sets.duration, t, sets.break)
      if (cls == undefined && p_i == (sets.groups_count - 1)) {
        // final pattern and no collisions
        // fill in without aligning
        for (var index = 0; index < sets.groups_count; index++) {
          pattern = patterns[patternSelector()]
          var violates = false
          for (var i = 0; i < pattern.length; i++) {
            if (!durationExists(coll[pattern[i]], sets.duration + sets.break)) violates = true
          }
          if (violates && index == patterns.length - 1) {
            warnings.push(warns.NoRoomWithPattern)
          } else if (!violates) {
            for (var i = 0; i < pattern.length; i++) {
              var cls = getRange(coll[pattern[i]], sets.duration, t, sets.break)
              cls.group = p_i
              cls.grade = gradeid
              cls.filled = true
              tt[pattern[i]].push(cls)
              tt[pattern[i]].sort(function (a, b) {
                return a.start - b.start
              })
              coll[pattern[i]] = removeTimeRange(cls, coll[pattern[i]])
            }
          }
        }
      } else if (cls == undefined) continue
      else {
        for (var i = 0; i < pattern.length; i++) {
          coll[pattern[i]] = removeTimeRange(cls, coll[pattern[i]])
          cls.group = p_i
          cls.grade = gradeid
          tt[pattern[i]].push(cls)
          tt[pattern[i]].sort(function (a, b) {
            return a.start - b.start
          })
        }
        c_coll = removeTimeRange(cls, c_coll)
      }
    }
    // EREG ACUTAL CODE
  }
  return tt
}

const chars = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]

function idToCode(id) {
  if (id == 0) return 'A0'
  var str = ''
  var flooredCharId = Math.floor((id - 1) / 999)
  var charid = flooredCharId
  while (charid >= 0) {
    if (charid - 25 > 0) {
      str += chars[0]
    } else {
      str += chars[charid]
    }
    charid -= 26
  }
  var lettersEqualivant = flooredCharId * 999
  str += id - lettersEqualivant
  return str
}

function codeToId(code) {
  var regex = /([A-Za-z]+)([0-9]+)/
  var groups = regex.exec(code)
  var letters = groups[1]
  var num = groups[2]
  var id = 0
  if (letters.length == 1) id = (chars.indexOf(letters[0]) * 999) + parseInt(num)
  else {
    id = ((letters.length - 1) * 26 * 999) + parseInt(num)
  }
  return id
}

var parseQS = function (queryString) {
  var params = {},
    queries, temp, i, l;
  // Split into key/value pairs
  queries = queryString.split("&");
  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }
  return params;
};

function stripDate(date, end) {
  date = new Date(date);
  if (end) date.setHours(23, 59, 59, 999);
  else date.setHours(0, 0, 0, 0);
  return date;
}

var dateFromObjectId = function (objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};