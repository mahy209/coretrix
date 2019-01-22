/*var input = [
    {name: "M", group: 1, start: 480, end: 600},
    {name: "C", group: 1, start: 600, end: 690},
    {name: "C", group: 2, start: 720, end: 810},
    {name: "E", group: 2, start: 750, end: 840},
    {name: "G", group: 1, start: 930, end: 1020},
    {name: "A", group: 1, start: 930, end: 1020},
    {name: "P", group: 1, start: 1050, end: 1140},
    {name: "E", group: 1, start: 1140, end: 1260},
];*/
/*
var days = {
    1: "Sat",
    2: "Sun",
    3: "Mon",
    4: "Tue",
    5: "Wed",
    6: "Thu"
}

for (var i = 1; i < 7; i++) {
    process.stdout.write(`${days[i]}     `);
    for (var e = 0; e < input.length; e++) {
        if (input[e].days.indexOf(i) > -1) {
            process.stdout.write(`${input[e].name}${input[e].group}    `);
        }
    }
    console.log();
}
*/
var input = [{
        name: "M",
        group: 1,
        start: 8,
        end: 10,
        days: [1, 2, 4, 5]
    },
    {
        name: "C",
        group: 1,
        start: 10,
        end: 11.5,
        days: [1, 3, 5]
    },
    {
        name: "C",
        group: 2,
        start: 12,
        end: 13.5,
        days: [2, 4, 6]
    },
    {
        name: "E",
        group: 2,
        start: 12.5,
        end: 14,
        days: [2, 5]
    },
    {
        name: "G",
        group: 1,
        start: 15.5,
        end: 17,
        days: [1, 4]
    },
    {
        name: "A",
        group: 1,
        start: 15.5,
        end: 17,
        days: [2, 5]
    },
    {
        name: "P",
        group: 1,
        start: 17.5,
        end: 19,
        days: [2, 4, 6]
    },
    {
        name: "E",
        group: 1,
        start: 19,
        end: 21,
        days: [1, 4]
    },
];

// 1- sort by start
// 2- generate edges using recursive calls

input = input.sort(function(a, b) {
    return a.start - b.start;
});

/**
 * [timeRangesCollide description]
 * @param  {[type]} rn1 [description]
 * @param  {[type]} rn2 [description]
 * @return {[type]}     [description]
 */
/*
----------------------
// true
     4           8
         6           10
   3           7
     4           8
// false
                 8    10
1    4
1 3*/

Number.prototype.inRange = (start, end) => {
    if (this > start && this < end) return true;
    else return false;
}
function timeRangesCollide(rn1, rn2) {
    if (rn2.start.inRange(rn1.start, rn1.end)) return true;
    if (rn2.start == rn1.start && (rn2.end == rn1.end || rn2.end.inRange(rn1.start, rn1.end))) return true;
    return false;
}
timeRangesCollide()
function node(name, group, start, end, days) {
    this.name = name;
    this.group = group;
    this.start = start;
    this.end = end;
    this.days = days;
    this.edges = [];
}

node.prototype.connect = function(b) {

}

var nodes = [];
for (var i = 0; i < input.length; i++) {
    nodes.push(new node(input[i].name, input[i].group, input[i].start, input[i].end, input[i].days));
}

console.log(nodes[0].connect(nodes[1]));
