var model = function() {
    return detect.parse(navigator.userAgent);
}
// array || y: percentage, name, exploded
function drawChart(id, text, data) {
    var chart = new CanvasJS.Chart(id, {
        title: {
            text: text
        },
        animationEnabled: true,
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "{name}: <strong>{y}%</strong>",
            indexLabel: "{name} {y}%",
            dataPoints: data
        }]
    });
    chart.render();
}
// validate lang
/*function getLang() {
    var got = Cookies.get('lang');
    if (got && (langs.indexOf(got) > -1)) return got;
    else {
        var defaultLang = 'english';
        Cookies.set('lang', defaultLang);
        return defaultLang;
    }
}*/

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

function next(min, max) {
    return function() {
        if (typeof arguments.callee.min != 'number') arguments.callee.min = min;
        if (typeof arguments.callee.max != 'number') arguments.callee.max = max;
        if (typeof arguments.callee.id != 'number') arguments.callee.id = min;
        if (arguments.callee.id > arguments.callee.max) {
            arguments.callee.id = arguments.callee.min;
            return arguments.callee.id++;
        } else return arguments.callee.id++;
    }
}

var lib = {
    ArrayOrObject: arrayOrObject,
    RemoveArrayWall: removeArrayWall,
    next: next
}
