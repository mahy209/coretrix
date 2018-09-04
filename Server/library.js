var dependencies = {};
var defaults = {};
// core dependencies
var http = require('http');
var util = require('util');
var fs = require('fs');
// imported dependencies
var now = require('performance-now');

function genNumber(num) {
    return Math.floor(Math.random() * (Math.pow(10, num)));
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

function stripDate(date, end) {
    if (end) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date;
}

function cloneObject(origin) {
    var temp = {};
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            temp[key] = origin[key];
        }
    }
    return temp;
};

function countWords(str) {
    var matches = str.split(' ');
    var ln = 0;
    for (var i = 0; i < matches.length; i++) {
        if (doublePartNameInit.indexOf(matches[i]) > -1) i++;
        ln += 1;
    }
    return ln;
}

var doublePartNameInit = [
    'عبد',
    'ابو'
]

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
].concat(specials);
// higher, lower, ok {name}
function neutralizeName(name) {
    if (!name) return undefined;
    if (name.match(/\n/g)) return {
        stat: 'lines'
    };
    /*if (countWords(name) < 4) {
        return undefined;
    }*/
    for (var i = 0; i < regexes.length; i++) {
        name = name.replace(regexes[i].regex, regexes[i].replacer);
    }
    return name;
}

function getObjectValues(obj) {
    var values = [];
    for (var key in obj) {
        values.push(key);
    }
    return values;
}

var validators = {
    ValidateString: function (str, limit) {
        if (!str || typeof str != 'string') return false;
        if (limit) {
            if (str.length <= limit) return true;
            else return false;
        }
        if (arguments.callee.limit) {
            if (str.length <= arguments.callee.limit) return true;
            else return false;
        }
        return true;
    },
    ValidateBoolean: function (bool) {
        return (typeof bool == 'boolean');
    },
    ValidateNumber: function (number) {
        return (typeof number == 'number');
    },
    ValidateNumberString: function (str) {
        if (!str || typeof str != 'string') return false;
        var regex = /^[0-9]*$/
        return regex.test(str);
    },
    ValidateBooleanNumber: function (number) {
        if (number === 0) return false;
        else if (number === 1) return true;
    },
    ValidateNumberRange: function () {
        return function (number, min, max) {
            min = defParam(arguments.callee.min, min);
            max = defParam(arguments.callee.max, max);
            if (validators.ValidateNumber(number)) {
                return (number >= min && number <= max);
            } else return false;
        };
    },
    ValidateObject: function (obj) {
        return arrayOrObject(obj) == "object";
    },
    ValidateFromValues: function (obj, vals) {
        vals = defParam(vals, arguments.callee.values);
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
    ValidateDate: function (dt) {
        return (dt && typeof dt == 'string' && new Date(dt) != "Invalid Date");
    },
    ValidateCoordinates: function (str) {
        var comma = str.indexOf(',')
        var latitude = str.substr(0, comma);
        var longitude = str.substr(++comma, str.length);
        if (validators.ValidateNumberRange(parseFloat(latitude), -90, 90) && validators.ValidateNumberRange(parseFloat(longitude), -180, 180)) return true;
        else return false;
    },
    ValidateArray: function (obj, callback) {
        var t = arrayOrObject(obj);
        if (t != "array") return false;
        var returner = [];
        for (var i = 0; i < obj.length; i++) {
            var value = obj[i];
            var validatorOut = arguments.callee.val(value);
            if (!validatorOut) {
                return false;
            }
            if (arguments.callee.giveid) validatorOut.id = i;
            if (arguments.callee.input) returner.push(validatorOut);
        }
        if (arguments.callee.input) return returner;
        return true;
    },
    //TODO
    ValidateMultiple: function (args, callback) {
        var vals = arguments.callee.validators;
        var index = 0;
        var length = vals.length;
        var loop = () => {
            if (index >= length) {
                return;
            }
        }
        loop();
    },
    Pass: function (arg) {
        return arg;
    }
}

validators.ValidateNumberStringArray = validators.ValidateArray.clone()
validators.ValidateNumberStringArray.val = validators.ValidateNumberString;
validators.ValidateRangedNumberArray = function (min, max) {
    var val = validators.ValidateArray.clone()
    val.validator = validators.ValidateNumberRange.clone();
    val.validator.min = min;
    val.validator.max = max;
    return val;
}
validators.ValidateNumberArray = validators.ValidateArray.clone()
validators.ValidateNumberArray.val = validators.ValidateNumber;
validators.ValidateStringArray = validators.ValidateArray.clone()
validators.ValidateStringArray.val = validators.ValidateString;

//TODO create a caching system for the distances
var bellmanFord = {
    /* INPUT: {'k1': [0,1], 'm1': [3,4],'m2': [5,6],'d1': [3,4],'d2': [6,7],'a1': [7,8],'a2': [9,10]},
    INPUT-SORTED: {'k1': [0,1], 'm1': [3,4],'d1': [3,4],'m2': [5,6],'d2': [6,7],'a1': [7,8],'a2': [9,10]},
    <distances>: how long it takes to go from one place to the other,
    1 hour, time gap between two time ranges to be inline
    20 minutes: how much time can be wasted
    */
    // OUTPUT: { 'k1': [['m1', 1], ['d1', 1]], ... }
    edges: function (schedule, distances, inlineLimit, lateOkay) {
        schedule = schedule.sort((a, b) => {
            return a[1] - b[1];
        });
        var min = [];
        var edgesVerticies = [];
        var h = {
            name: 0,
            id: 1,
            start: 2,
            end: 3
        }
        for (var i = 1; i < schedule.length; i++) {
            //TODO complete
            /* terms to from an edge
            1- They do not collide with one another
            2- Name is different
            3- Start2 - End1 >= 0
            */
            var timeDiff = schedule[i][h.start] - schedule[0][h.end];
            var weight = timeDiff >= 0;
            /* weight terms
            1
            ----
            // 3-1 = 2 > 1 so it's -1
            // 3-3 = 0 < 1 so it's 1
            // 5-4 = 1 = 1 so it's 1
            Start2 - End1 >= inlineLimit
            ------------
            */
            weight = (weight > inlineLimit) ? '-1' : '1';

            if (min[h.start] == schedule[i][h.start]) edgesVerticies.push([schedule[0][h.name], schedule[0][h.id], schedule[i][h.name], schedule[i][h.id], weight]);
            else if (i != 1) break;
            else {
                min = schedule[i];
                edgesVerticies.push([schedule[0][h.name], schedule[0][h.id], schedule[i][h.name], schedule[i][h.id], weight]);
            }
        }
        return edgesVerticies;
    },
    // INPUT: ['k1','m1','m2','d1','d2','a1','a2'], { edges <output> }, k1
    // OUTPUT: [ 'k1', 'm1', 'd2', 'a1']
    solve: function (verticies, edges, start) {

    }
}

/*console.log(bellmanFord.edges([
    ['m', 1, 3, 4],
    ['m', 2, 5, 6],
    ['a', 2, 9, 10],
    ['d', 1, 3, 4],
    ['d', 2, 6, 7],
    ['a', 1, 7, 8],
    ['k', 1, 0, 1]
]));*/

function defParam(param, def) {
    if (param != undefined) return param;
    else return def;
}

function jsDate() {
    return Date.now();
}

function arrayOrObject(value) {
    if (typeof value == "object") {
        if (Array.isArray(value)) return "array";
        else return "object";
    } else return undefined;
}

//TODO ignore normal values and only work on arrays
function removeArrayWall(arr, rmWall, specialArg) {
    var l = arr.length;
    var result = [];
    for (var i = 0; i < l; i++) {
        var sp = arr.splice(0, 1)[0];
        if (specialArg && (ArrayOrObject(sp) == "object")) result.push(sp[specialArg]);
        else {
            if (rmWall) result = result.concat(sp);
            else result.push(sp);
        };
    }
    return result;
}

function stringConverter(obj) {
    return obj.toString();
}

function convertArray(arr, converter) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toString();
    }
    return arr;
}

var per = {};

function performanceLog(name) {
    var time = now();
    if (per[name]) {
        var digits = 4;
        console.log(name + ": " + round((time - per[name]), digits) + " ms");
        delete per[name];
    } else {
        per[name] = now();
    }
}

function filesize(path) {
    try {
        var stats = fs.statSync(path);
        return stats["size"];
    } catch (e) {
        return 0;
    }
}

function removeDuplicates(arr) {
    var unique = arr.filter(function (elem, index, self) {
        return (index == arr.indexOf(elem));
    });
    return unique;
}

function getValuesFromObjectArray(arr, key) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key))
            result.push(arr[i][key]);
    }
    return result;
}
if (!now) now = dependencies["performance-now"];
// return false if it's invalid and true if valid

function convertCoordinatesAddress(origin, language, coordToAddress, callback) {
    http.get(encodeURI(util.format("http://maps.googleapis.com/maps/api/geocode/json?address=%s&language=%s", origin, language)), function (res) {
        var data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            var json = JSON.parse(data);
            var returner;
            try {
                if (coordToAddress) returner = json.results[0].formatted_address;
                else returner = json.results[0].geometry.location.lat.toString() + ',' + json.results[0].geometry.location.lng.toString();
                callback(returner);
            } catch (e) {
                callback(null);
            }
        });
    }).on('error', function (err) {
        throw err;
    })
}

function getDistance(origin, destination, mode, callback) {
    http.get(encodeURI(util.format("http://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&mode=%s", origin, destination, mode)), function (res) {
        var data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            var json = JSON.parse(data);
            var returner = json.rows[0].elements[0];
            delete returner.status;
            callback(returner);
        });
    }).on('error', function (err) {
        throw err;
    });
}

function intInc(i, first) {
    if (first) return 0;
    else return i + 1;
}

function round(num, digits) {
    if (digits == -1) return num;
    digits = Math.pow(10, defParam(digits, 2));
    return Math.round(num * digits) / digits;
}

function diffDays(date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / (oneDay));
}

function diffArrays(origin, edited) {
    var returner = {
        added: [],
        removed: [],
        same: [],
        changed: false
    };
    if (origin == null || edited == null) return returner;
    for (var i = 0; i < edited.length; i++) {
        var index = origin.indexOf(edited[i]);
        if (index > -1) {
            returner.same.push(edited[i]);
            if (index > -1) origin.splice(index, 1);
        } else returner.added.push(edited[i]);
    }
    returner.removed = origin;
    if (returner.added.length > 0 || returner.removed.length > 0) returner.changed = true;
    return returner;
}

function removeValuesFromArray(arr, values) {
    var removed = [];
    for (var i = 0; i < values.length; i++) {
        var index = arr.indexOf(values[i]);
        if (index > -1) {
            removed = removed.concat(arr.splice(index, 1));
        }
    }
    return {
        result: arr,
        removed: removed
    };
}

function ArrayToObject(arr, specialArg, remove) {
    arr = JSON.parse(JSON.stringify(arr));
    remove = defParam(remove, true);
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        var sp = value[specialArg];
        if (remove) delete value[specialArg];
        obj[sp] = value;
    }
    return obj;
}

function getArrayComparator(arr, specialArg, asc) {
    asc = defParam(asc, 1);
    return function (a, b) {
        if (specialArg) {
            if (arr.indexOf(a[specialArg].toString()) > arr.indexOf(b[specialArg].toString())) {
                return 1 * asc;
            } else return -1 * asc;
        } else {
            if (arr.indexOf(a) > arr.indexOf(b)) {
                return 1 * asc;
            } else return -1 * asc;
        }
    };
}

function arraysCollision(arr1, arr2) {
    var arr = arr1;
    var other = arr2;
    if (arr1.length >= arr2.length) {
        arr = arr2;
        other = arr1
    };
    var returner = false;
    for (var i = 0; i < arr.length; i++) {
        if (other.indexOf(arr[i]) > -1) {
            if (!returner) returner = [];
            returner.push(arr[i]);
        }
    }
    return returner;
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function simpleDate(date) {
    return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
}

function removeInvalidChars(str) {
    return str.replace(/\0/g, '');
}

function numberToString(number, length) {
    number = number.toString();
    if (number.length > length) return undefined;
    else {
        var zeros = length - number.length;
        var returner = "";
        for (var i = 0; i < zeros; i++) {
            returner += "0";
        }
        returner += number;
        return returner;
    }
}
/**
 * Overlay two objects
 * @param  {[object]} origin  [original object]
 * @param  {[object]} layer [new object]
 * @return {[object]}         [two objects with origin overwritten]
 */
function overlayArray(origin, layer) {
    origin = cloneObject(origin);
    for (var key in layer) {
        origin[key] = layer[key];
    }
    return origin;
}

function next(min, max) {
    return function () {
        if (typeof arguments.callee.min != 'number') arguments.callee.min = min;
        if (typeof arguments.callee.max != 'number') arguments.callee.max = max;
        if (typeof arguments.callee.id != 'number') arguments.callee.id = min;
        if (arguments.callee.id > arguments.callee.max) {
            arguments.callee.id = arguments.callee.min;
            return arguments.callee.id++;
        } else return arguments.callee.id++;
    }
}

module.exports = {
    DoublePartNameInit: doublePartNameInit,
    // generals
    defParam: defParam,
    OverlayArray: overlayArray,
    DaysDifference: diffDays,
    SimpleDate: simpleDate,
    Round: round,
    RemoveArrayWall: removeArrayWall,
    ArrayOrObject: arrayOrObject,
    RemoveDuplicates: removeDuplicates,
    ConvertArray: convertArray,
    ArrayToObject: ArrayToObject,
    GetArrayComparator: getArrayComparator,
    PerformanceLog: performanceLog,
    FileSize: filesize,
    jsDate: jsDate,
    RemoveInvalidChars: removeInvalidChars,
    GetDistance: getDistance,
    ConvertCoordinatesAddress: convertCoordinatesAddress,
    GetValuesFromObjectArray: getValuesFromObjectArray,
    ArraysCollision: arraysCollision,
    NumberToString: numberToString,
    ArraysDifference: diffArrays,
    RemoveValuesFromArray: removeValuesFromArray,
    NeutralizeName: neutralizeName,
    CountWords: countWords,
    next: next,
    stripDate: stripDate,
    // converters
    StringConverter: stringConverter,
    // generators
    GenerateNumber: genNumber,
    // incrementers
    IntIncrementer: intInc,
    // validators
    validators: validators
};
