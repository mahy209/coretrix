var chars = [
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
    'Z',
]

function idToCode(id) {
    if (id==0) return "A0";
    var str = '';
    var flooredCharId = Math.floor((id - 1) / 999);
    var charid = flooredCharId;
    while (charid >= 0) {
        if (charid - 25 > 0) {
            str += chars[0];
        } else {
            str += chars[charid];
        }
        charid -= 26;
    }
    var lettersEqualivant = flooredCharId * 999;
    str += id - lettersEqualivant;
    return str;
}

function codeToId(code) {
    var regex = /([A-Za-z]+)([0-9]+)/
    var groups = regex.exec(code);
    var letters = groups[1];
    var num = groups[2];
    var id = 0;
    if (letters.length == 1) id = (chars.indexOf(letters[0]) * 999) + parseInt(num);
    else {
        id = ((letters.length - 1) * 26 * 999) + parseInt(num);
    }
    return id;
}

console.log(idToCode(0)); // A0
console.log(idToCode(1)); // A1
console.log(idToCode(6)); // A6
console.log(idToCode(29)); // A29
console.log(idToCode(998)); // A998
console.log(idToCode(1001)); // B2
console.log(idToCode(2000)); // C2
console.log(idToCode(25973)); // Z998
console.log(idToCode(25974)); // Z999
console.log(idToCode(25975)); // AA1
console.log(idToCode(25978)); // AA4
console.log(codeToId("A0")); // 0
console.log(codeToId("A1")); // 1
console.log(codeToId("A5")); // 5
console.log(codeToId("B2")); // 1001
console.log(codeToId("B999")); // 1001
console.log(codeToId("Z5")); // 24980
/* Z999 = AA0 ... code generator doesn't generate AA0 or Z0 only A0 */ 
console.log(codeToId("Z999")); // 25974
console.log(codeToId("AA0")); // 25974
console.log(codeToId("AA1")); // 25975
