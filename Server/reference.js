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
    MediaNotFound: 32,
    NoPermissions: 33,
    InvalidPhoneKeys: 34
}

// high resolution time measurement
var now = require("performance-now");
var compile = require("string-template/compile");
var util = require('util');
var sqlite3 = require("sqlite3")
var db = new sqlite3.Database("databases/main");
var mcrypt = require('mcrypt').MCrypt;
const key = 'SDFruHxmmjUAmZqvuNPXPg3MxLSCnWrf';
const timeTypes = {
    "minutes": 0,
    "hours": 1,
    "days": 2
};
const fileTypes = {
    "image": 0,
    "video": 1,
    "document": 2,
    "other": 3
};
const searchCategories = {
    Teachers: 0,
    Bids: 1,
    Students: 2,
    Posts: 3,
    Reviews: 4,
    Comments: 5,
    TeacherViews: 6
}
const notifications = {
    BidRemoval: 0,
    BidEdit: 1,
    ProfileView: 2,
    AddressEdit: 3,
    Order: 4
}
var authFreq = inMilliseconds(8, timeTypes.hours);
var crypto = new mcrypt('rijndael-128', 'ecb');
crypto.open(key);

function encrypt(data) {
    return crypto.encrypt(data).toString('base64');
}

function decrypt(chiper) {
    return removeInvalidChars(crypto.decrypt(new Buffer(chiper, 'base64')).toString());
}

function removeInvalidChars(str) {
    return str.replace(/\0/g, '');
}

function inMilliseconds(input, type) {
    switch (type) {
        case timeTypes.minutes:
            return input * 60 * 1000;
        case timeTypes.hours:
            return input * 60 * 60 * 1000;
        case timeTypes.days:
            return input * 24 * 60 * 60 * 1000;
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

function getPath(file) {
    return "media/" + file;
}

function date() {
    return Date.now();
}

function createToken(user, model, device) {
    return encrypt(JSON.stringify({
        unique: date(),
        user: user,
        device: device,
        model: model,
    }));
}

function readToken(token) {
    return JSON.parse(decrypt(token));
}

function checkToken(token, callback) {
    try {
        var json = readToken(token);
        db.all(util.format("select * from users where username='%s' OR email='%s'", json.user, json.user), function(err, rows) {
            if (err)
                return false;
            else {
                if (rows && rows.length == 1) {
                    if (rows[0].tokens.indexOf(token) > -1) {
                        callback(rows[0]);
                    } else callback(false);
                } else callback(false);
            }
        });
    } catch (e) {
        callback(false);
        return;
    }
}

function checkExistance(user, callback) {
    db.all(util.format("select id from users where email='%s' OR username='%s'", user, user), function(err, rows) {
        if (rows) callback(err, rows.length > 0);
        else callback(err, false);
    });
}

function validateEmail(x) {
    if (typeof x != 'string') return false;
    else {
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) return false;
        else return true;
    }
}

function checkEmail(email, callback) {
    db.all(util.format("select id from users where email='%s'", email), function(err, rows) {
        if (rows) callback(err, rows.length > 0);
        else callback(err, false);
    });
}

function checkUser(username, callback) {
    db.all(util.format("select id from users where username='%s'", username), function(err, rows) {
        if (rows) callback(err, rows.length > 0);
        else callback(err, false);
    });
}

function checkDisplay(displayname, callback) {
    db.all(util.format("select id from users where displayname='%s'", displayname), function(err, rows) {
        if (rows) callback(err, rows.length > 0);
        else callback(err, false);
    });
}
//TODO use sqlite backup api
function authorize(user, password, model, device, callback) {
    db.all(util.format("select tokens,type from users where password='%s' AND username='%s' OR email='%s'", encrypt(password), user, user), function(err, rows) {
        if (!err) {
            if (rows && rows.length == 1) {
                console.log(now());
                var token = createToken(user, model, device);
                console.log(now());
                var tokens = {};
                if (rows[0].tokens) {
                    //BACKUP
                    /*
                    tokens = JSON.parse(rows[0].tokens);
                    var tokensids = Object.keys(tokens);
                    id = tokensids.length;
                    var tokensuuids = [];
                    for (var t in tokens) {
                        tokensuuids.push(tokens[t]);
                    }
                    while (tokensids.indexOf(id.toString()) > -1) {
                        id++;
                    }
                    while (tokensuuids.indexOf(token) > -1)
                        token = createToken(user, model, device);
                    tokens[id] = createToken(user, model, device);
                    */
                    tokens = JSON.parse(rows[0].tokens);
                    token = createToken(user, model, device);
                    var tokensids = Object.keys(tokens);
                    var newid = parseInt(tokensids[tokensids.length - 1]) + 1;
                    while (tokens.hasOwnProperty(newid)) {
                        token = createToken(user, model, device);
                    }
                    tokens[newid] = {
                        token: token
                    };
                } else
                    tokens["0"] = {
                        token: token
                    };
                console.log(now());
                //JSON.stringify(tokens)
                db.run(util.format("update users SET tokens='%s' where username='%s' OR email='%s'", "", user, user), function(err) {
                    console.log(now());
                    if (!err) {
                        callback(null, stats.OK, {
                            token: token,
                            type: rows[0].type,
                            username: rows[0].username
                        });
                    } else {
                        callback(err, stats.Error);
                    }
                });
            } else {
                checkExistance(user, function(err, existance) {
                    if (err)
                        callback(err, stats.Error);
                    else {
                        callback(null, existance ? stats.WrongPassword : stats.UserNonExisting);
                    }
                });
            }
        } else {
            callback(err, stats.Error);
        }
    });
}
//TODO confirm new devices
//TODO here
function deAuthorize(token, tokenid, callback) {
    validate(token, function success(user) {
        var tokens = JSON.parse(user.tokens);

        if (tokens[tokenid]) {
            delete tokens[tokenid];
            db.run(util.format("update users set tokens='%s' where id='%s'", JSON.stringify(tokens), user.id), function(err) {
                if (!err)
                    callback(null, stats.OK, tokens);
                else
                    callback(err, stats.Error);
            })
        } else
            callback(null, stats.NonExisting);
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getTokens(token, callback) {
    validate(token, function success(user) {
        var tokens = JSON.parse(user.tokens);
        var returner = {};
        for (var key in tokens) {
            var cToken = tokens[key];
            var decToken = readToken(cToken.token);
            if (cToken.token == token)
                decToken.current = true;
            // used delete to make space for other props if wanted
            delete decToken.user;
            delete decToken.unique;
            decToken.confirmed = cToken.confirmed;
            returner[key] = decToken;
        }
        callback(null, stats.OK, returner);
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function register(display, user, email, password, type, callback) {
    checkEmail(email, function(errEmail, dEmail) {
        if (!errEmail) {
            checkUser(user, function(errUser, dUser) {
                if (!errUser) {
                    checkDisplay(display, function(errDisplay, dDisplay) {
                        if (!errDisplay) {
                            if (dEmail || dUser || dDisplay) {
                                callback(null, stats.Exists, [dEmail, dUser, dDisplay]);
                            } else {
                                db.run(util.format("insert into users (username, email, displayname, password, type, date) values ('%s','%s','%s','%s','%s',%d)", user, email, display, encrypt(password), type, date()), function(err) {
                                    if (!err) {
                                        db.run(util.format("insert into '%s' (username) VALUES ('%s')", type, user), function(err) {
                                            if (!err)
                                                callback(null, stats.OK, null);
                                            else
                                                callback(err, stats.Error, null);
                                        });
                                    } else {
                                        callback(err, stats.Error, null);
                                    }
                                });
                            }
                        } else {
                            callback(errDisplay, stats.Error, null);
                        }
                    });
                } else {
                    callback(errUser, stats.Error, null);
                }
            });
        } else {
            callback(errEmail, stats.Error, null);
        }
    });
}

function validate(token, successCallback, failureCallback) {
    checkToken(token, function(result) {
        if (result) {
            successCallback(result);
        } else {
            failureCallback();
        }
    });
}

/* TEMPLATE
function func_name(token, arg, callback) {
    validate(token, function success(user) {

    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
TEMPLATE */
function addAddress(token, address, map, phones, callback) {
    validate(token, function success(user) {
        db.all(util.format("select phones from users where username='%s'", user.username), function(err, rows) {
            if (rows && rows.length > 0) {
                var phonesKeys = Object.keys(JSON.parse(rows[0].phones));
                var invalidKeys = [];
                for (var key in phones) {
                    if (phones.hasOwnProperty(key)) {
                        if (!(phonesKeys.indexOf(key) > 0))
                            invalidKeys.push(phones[key]);
                    }
                }
                if (invalidKeys.length > 0) {
                    db.all(util.format("select addresses from teachers where username='%s'", user.username), function(err, rows) {
                        if (rows && rows.length > 0) {
                            var addresses = {};
                            if (rows[0].addresses)
                                addresses = JSON.parse(rows[0].addresses);
                            var existing = false;
                            for (var key in addresses) {
                                if (addresses.hasOwnProperty(key)) {
                                    if (addresses[key].address == address)
                                        existing = true;
                                }
                            }
                            if (!existing) {
                                var ids = Object.keys(addresses);
                                id = ids.length;
                                while (ids.indexOf(id.toString()) > -1) {
                                    id++;
                                }
                                addresses[id] = {
                                    address: address,
                                    map: map,
                                    phones: phones
                                };
                                db.run(util.format("update teachers set addresses='%s' where username='%s'", JSON.stringify(addresses), user.username), function(err) {
                                    if (err)
                                        callback(null, stats.Error);
                                    else
                                        callback(null, stats.OK, addresses);
                                });
                            } else callback(null, stats.Exists);
                        } else callback(null, stats.NonExisting);
                    });
                } else callback(null, stats.InvalidPhoneKeys, invalidKeys);
            } else callback(null, stats.NonExisting);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO super timetable algorithm
//TODO test
function removeAddress(token, id, callback) {
    validate(token, function success(user) {
        db.all(util.format("select addresses from teachers where username='%s'", user.username), function(err, rows) {
            console.log(rows);
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    db.all(util.format("select id from bids where address=%d", id), function(err, rows) {
                        console.log(rows);
                        if (err)
                            callback(err, stats.Error);
                        else {
                            if (rows && rows.length > 0) {
                                var output = [];
                                for (var row in rows) {
                                    output.push(row.id);
                                }
                                callback(null, stats.Associated, output);
                            } else {
                                var addresses = {};
                                if (rows[0].addresses)
                                    addresses = JSON.parse(rows[0].addresses);
                                if (addresses[id]) {
                                    delete addresses[id];
                                    db.run(util.format("update teachers set addresses='%s' where username='%s'", JSON.stringify(addresses), user.username), function(err) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else
                                            callback(null, stats.OK, addresses);
                                    });
                                } else callback(null, stats.NonExisting);
                            }
                        }
                    });
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editAddress(token, id, address, map, phones, callback) {
    validate(token, function success(user) {
        db.all(util.format("select addresses from teachers where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        var addresses = {};
                        if (rows[0].addresses)
                            addresses = JSON.parse(rows[0].addresses);
                        if (addresses[id]) {
                            var changes = [];
                            if (address) {
                                addresses[id].address = address;
                                changes.shift('address');
                            }
                            if (map) {
                                addresses[id].map = map;
                                changes.shift('map');
                            }
                            if (phones) {
                                addresses[id].phones = phones;
                                changes.shift('phones');
                            }
                            db.run(util.format("update teachers set addresses='%s' where username='%s'", JSON.stringify(addresses), user.username), function(err) {
                                if (err)
                                    callback(err, stats.Error);
                                else {
                                    callback(null, stats.OK, addresses);
                                    db.run(util.format("insert into notifications (username,`action`,data,`data2`,`date`) select username, %d as action, '%s' as data, (select id from bids where teacher='%s' and address=%d) as data2 %d as date from orders where bid=(select id from bids where teacher='%s' and address=%d)", notifications.AddressEdit, JSON.stringify({
                                        teacher: user.username,
                                        changes: changes
                                    }), date(), user.username, id));
                                }
                            });
                        } else callback(null, stats.NonExisting);
                    } else callback(null, stats.UserNonExisting);
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO test
function order(token, bid, callback) {
    validate(token, function success(user) {
            db.all(util.format("select id from students where username='%s'", user.username), function(err, rows) {
                if (err)
                    callback(err, stats.Error);
                else {
                    if (rows && rows.length > 0) {
                        db.all(util.format("select open,teacher from bids where id=%d", bid), function(err, rows) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                if (rows && rows.length > 0) {
                                    if (rows[0].open == 1) {
                                        var teacher = rows[0].teacher;
                                        db.all(util.format("select id from orders where teacher=(select teacher from bids where id=%d) and bid=%d and user='%s'", bid, bid, user.username), function(err, rows) {
                                            if (err)
                                                callback(err, stats.Error);
                                            else {
                                                if (rows && rows.length > 0)
                                                    callback(null, stats.Exists);
                                                else {
                                                    db.run(util.format("insert into orders (user,teacher,bid,date) values ('%s',(select teacher from bids where id=%d),%d,%d)", user.username, bid, bid, date()), function(err, rows) {
                                                        if (err)
                                                            callback(err, stats.Error);
                                                        else {
                                                            callback(null, stats.OK);
                                                            db.run(util.format("insert into notifications (username,`action`,`data`,date) values ('%s',%d,1,%d)", teacher, notifications.Order, date()));
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else callback(null, stats.BidClosed);
                                } else callback(null, stats.NonExisting);
                            }
                        });
                    } else callback(null, stats.NotStudent);
                }
            });
        },
        function failure() {
            callback(null, stats.InvalidToken);
        });
}
//TODO test
function returnOrder(token, order, callback) {
    validate(token, function success(user) {
            db.all(util.format("select id from students where username='%s'", user.username), function(err, rows) {
                if (err)
                    callback(err, stats.Error);
                else {
                    if (rows && rows.length > 0) {
                        var autoreturn = true;
                        db.all(util.format("select id from returnorders where `order`=%d", order), function(err, rows) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                if (rows && rows.length > 0) {
                                    callback(null, stats.ReturnOrderPending);
                                } else {
                                    db.all(util.format("select teacher,payed,bid from orders where id=%d", order), function(err, rows) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else {
                                            if (rows && rows.length > 0) {
                                                var teacher = rows[0].teacher;
                                                var bid = rows[0].bid;
                                                var payed = [];
                                                if (rows[0].payed)
                                                    payed = JSON.parse(rows[0].payed);
                                                if (payed.length > 0) {
                                                    db.all(util.format("select prices from bids where teacher='%s' and id=%d", teacher, bid), function(err, rows) {
                                                        if (err)
                                                            callback(err, stats.Error);
                                                        else {
                                                            if (rows && rows.length > 0) {
                                                                var prices = [];
                                                                if (rows[0].prices)
                                                                    prices = JSON.parse(rows[0].prices);
                                                                var price = 0;
                                                                for (var item in payed) {
                                                                    if (payed.hasOwnProperty(item)) {
                                                                        price += prices[payed[item]];
                                                                    }
                                                                }
                                                                if (price) {
                                                                    db.all(util.format("select (select autoreturn from teachers where username=(select teacher from orders where id='%d')) as autoreturn,balance from users where username=(select teacher from orders where id='%d')", order, order), function(err, rows) {
                                                                        if (err)
                                                                            callback(err, stats.Error);
                                                                        else {
                                                                            if (rows && rows.length > 0) {
                                                                                autoreturn = rows[0].autoreturn;
                                                                                var balance = rows[0].balance;
                                                                                if (autoreturn && balance >= price) {
                                                                                    var readdmon = function() {
                                                                                        db.run(util.format("update users set balance=balance+%d where username='%s'", price, teacher), function(err) {
                                                                                            if (err)
                                                                                                try {
                                                                                                    fs.writeFileSync('logs/returnerrors/' + date(), JSON.stringify({
                                                                                                        autoreturn: autoreturn,
                                                                                                        balance: balance,
                                                                                                        prices: prices,
                                                                                                        price: price,
                                                                                                        teacher: teacher,
                                                                                                        user: user,
                                                                                                        token: token,
                                                                                                        order: order
                                                                                                    }));
                                                                                                } catch (e) {
                                                                                                    console.log(e.stack);
                                                                                                }
                                                                                        });
                                                                                    };
                                                                                    db.run(util.format("update users set balance=balance-%d where username='%s'", price, teacher), function(err) {
                                                                                        if (err)
                                                                                            callback(err, stats.Error);
                                                                                        else {
                                                                                            db.run(util.format("delete from orders where id=%d", order), function(err) {
                                                                                                if (err) {
                                                                                                    callback(err, stats.Error);
                                                                                                    readdmon();
                                                                                                } else {
                                                                                                    db.run(util.format("update users set balance=balance+%d where username='%s'", price, user.username), function(err) {
                                                                                                        if (err) {
                                                                                                            callback(err, stats.Error);
                                                                                                            fs.writeFileSync('logs/debts/' + date(), JSON.stringify({
                                                                                                                autoreturn: autoreturn,
                                                                                                                balance: balance,
                                                                                                                prices: prices,
                                                                                                                price: price,
                                                                                                                teacher: teacher,
                                                                                                                user: user,
                                                                                                                token: token,
                                                                                                                order: order
                                                                                                            }));
                                                                                                        } else {
                                                                                                            callback(null, stats.OK);
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    db.run(util.format("insert into returnorders (teacher,username,`order`,date) values ('%s','%s',%d,'%s',%d)", teacher, user.username, order, date()), function(err) {
                                                                                        if (err)
                                                                                            callback(err, stats.Error);
                                                                                        else
                                                                                            callback(null, stats.PlacedReturnOrder);
                                                                                    });
                                                                                };
                                                                            } else callback(null, stats.TargetUserNonExisting);
                                                                        }
                                                                    });
                                                                } else callback(null, stats.NonExisting);
                                                            } else callback(null, stats.OrderNonExisting);
                                                        }
                                                    });
                                                } else callback(null, stats.NotPayed);
                                            } else callback(null, stats.OrderNonExisting);
                                        }
                                    });
                                }
                            }
                        });
                    } else callback(null, stats.NotStudent);
                }
            });
        },
        function failure() {
            callback(null, stats.InvalidToken);
        });
}

function cancelReturnOrder(token, order, item, callback) {
    validate(token, function success(user) {
            db.all(util.format("select id from students where username='%s'", user.username), function(err, rows) {
                if (err)
                    callback(err, stats.Error);
                else {
                    if (rows && rows.length > 0) {
                        db.all(util.format("select id from returnorders where `order`=%d", order), function(err, rows) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                if (rows && rows.length > 0) {
                                    db.run(util.format("delete from returnorders where id=%d", rows[0].id), function(err) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else
                                            callback(err, stats.OK);
                                    });
                                } else {
                                    callback(null, stats.NonExisting);
                                }
                            }
                        });
                    } else callback(null, stats.NotStudent);
                }
            });
        },
        function failure() {
            callback(null, stats.InvalidToken);
        });
}

function approveReturnOrder(token, order, item, callback) {
    validate(token, function success(user) {
            db.all(util.format("select id from teachers where username='%s'", user.username), function(err, rows) {
                if (err)
                    callback(err, stats.Error);
                else {
                    if (rows && rows.length > 0) {
                        db.all(util.format("select id,username from returnorders where `order`=%d", order), function(err, rows) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                if (rows && rows.length > 0) {
                                    var student = rows[0].username;
                                    db.all(util.format("select prices from bids where teacher='%s' and id=(select bid from orders where id=%d)", user.username, order), function(err, rows) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else {
                                            if (rows && rows.length > 0) {
                                                var prices = [];
                                                if (rows[0].prices)
                                                    prices = JSON.parse(rows[0].prices);
                                                var price = prices[item];
                                                if (price) {
                                                    db.all(util.format("select balance from users where username=(select teacher from orders where id=%d)", order), function(err, rows) {
                                                        if (err)
                                                            callback(err, stats.Error);
                                                        else {
                                                            if (rows && rows.length > 0) {
                                                                var balance = rows[0].balance;
                                                                if (balance >= price) {
                                                                    var readdmon = function() {
                                                                        db.run(util.format("update users set balance=balance+%d where username='%s'", price, student), function(err) {
                                                                            if (err)
                                                                                try {
                                                                                    fs.writeFileSync('logs/returnerrors/' + date(), JSON.stringify({
                                                                                        autoreturn: autoreturn,
                                                                                        balance: balance,
                                                                                        prices: prices,
                                                                                        price: price,
                                                                                        teacher: teacher,
                                                                                        user: user,
                                                                                        token: token,
                                                                                        order: order
                                                                                    }));
                                                                                } catch (e) {
                                                                                    console.log(e.stack);
                                                                                }
                                                                        });
                                                                    };
                                                                    db.run(util.format("update users set balance=balance-%d where username='%s'", price, user.username), function(err) {
                                                                        if (err)
                                                                            callback(err, stats.Error);
                                                                        else {
                                                                            db.run(util.format("update returnorders set approved=1 where `order`=%d", order), function(err) {
                                                                                if (err) {
                                                                                    callback(err, stats.Error);
                                                                                    readdmon();
                                                                                } else {
                                                                                    db.run(util.format("update users set balance=balance+%d where username='%s'", price, user.username), function(err) {
                                                                                        if (err) {
                                                                                            callback(err, stats.Error);
                                                                                            fs.writeFileSync('logs/debts/' + date(), JSON.stringify({
                                                                                                autoreturn: autoreturn,
                                                                                                balance: balance,
                                                                                                prices: prices,
                                                                                                price: price,
                                                                                                teacher: teacher,
                                                                                                user: user,
                                                                                                token: token,
                                                                                                order: order
                                                                                            }));
                                                                                        } else {
                                                                                            callback(null, stats.OK);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                } else callback(null, stats.NoEnoughMoney);
                                                            } else callback(null, stats.TargetUserNonExisting);
                                                        }
                                                    });
                                                } else callback(null, stats.NonExisting);
                                            } else callback(null, stats.OrderNonExisting);
                                        }
                                    });
                                } else callback(null, stats.NonExisting);
                            }
                        });
                    } else callback(null, stats.NotTeacher);
                }
            });
        },
        function failure() {
            callback(null, stats.InvalidToken);
        });
}

function getAddresses(token, callback) {
    validate(token, function success(user) {
        db.all(util.format("select addresses from teachers where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        var addresses = {};
                        if (rows[0].addresses)
                            addresses = JSON.parse(rows[0].addresses);
                        callback(null, stats.OK, addresses);
                    } else callback(null, stats.UserNonExisting);
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function addPhone(token, phone, callback) {
    validate(token, function success(user) {
        var phones = {};
        if (user.phones)
            phones = JSON.parse(user.phones);
        var ids = Object.keys(phones);
        id = ids.length;
        while (ids.indexOf(id.toString()) > -1) {
            id++;
        }
        phones[id] = phone;
        db.run(util.format("update users set phones='%s' where username='%s'", JSON.stringify(phones), user.username), function(err) {
            if (err)
                callback(null, stats.Error);
            else
                callback(null, stats.OK, phones);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editPhone(token, id, phone, callback) {
    validate(token, function success(user) {
        var phones = {};
        if (user.phones)
            phones = JSON.parse(user.phones);
        if (phones[id]) {
            if (phone)
                phones[id] = phone;
            else {
                callback(null, stats.InvalidData);
                return;
            }
            db.run(util.format("update users set phones='%s' where id='%s'", JSON.stringify(phones), user.id), function(err) {
                if (err)
                    callback(err, stats.Error);
                else
                    callback(null, stats.OK, phones);
            });
        } else callback(null, stats.NonExisting);
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO test
function removePhone(token, id, callback) {
    validate(token, function success(user) {
        var phones = {};
        if (user.phones)
            phones = JSON.parse(user.phones);
        if (phones[id]) {
            var finish = function() {
                delete phones[id];
                db.run(util.format("update users set phones='%s' where username='%s'", JSON.stringify(phones), user.username), function(err) {
                    if (err)
                        callback(err, stats.Error);
                    else
                        callback(null, stats.OK, phones);
                });
            };
            if (user.type == "teachers") {
                db.all(util.format("select addresses from teacher where username='%s'", user.username), function(err, rows) {
                    if (err)
                        callback(err, stats.Error);
                    else {
                        if (rows & rows.length > 0) {
                            var addresses = {};
                            if (rows.addresses)
                                addresses = JSON.parse(rows.addresses);
                            var assocs = [];
                            for (var address in addresses) {
                                var addr_phones = addresses[address].phones;
                                for (var i = 0; i < addr_phones.length; i++) {
                                    if (addr_phones[i] == id) {
                                        assocs.push(address);
                                        break;
                                    }
                                }
                            }
                            if (assocs.length > 0)
                                callback(null.stats.Associated, assocs);
                            else
                                finish();
                        } else {
                            finish();
                        }
                    }
                });
            } else {
                finish();
            }
        } else callback(null, stats.NonExisting);

    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getPhones(token, callback) {
    validate(token, function success(user) {
        var phones = {};
        if (user.phones)
            phones = JSON.parse(user.phones);
        callback(null, stats.OK, phones);
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editAutoReturn(token, val, callback) {
    validate(token, function success(user) {
        db.run(util.format("update teachers set autoreturn='%s' where username='%s'", val, user.username), function(err) {
            if (err)
                callback(err, stats.Error);
            else
                callback(null, stats.OK);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editProfilePicture(token, mediaid, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from media where id=%d and completed=1 and type=0", mediaid), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length >= 1) {
                    db.run(util.format("update users set profilepic=%d where username='%s'", mediaid, user.username), function(err) {
                        if (err)
                            callback(err, stats.Error);
                        else
                            callback(null, stats.OK);
                    });
                } else callback(null, stats.MediaNotFound);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getIntro(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select subjects,bio,rate from teachers where username='%s'", targetuser), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        var returner = rows[0];
                        returner.subjects = JSON.parse(returner.subjects);
                        returner.displayname = user.displayname;
                        callback(null, stats.OK, returner);
                    } else callback(null, stats.UserNonExisting);
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO subject_edit&add check bids
//TODO test
function bid(token, timetable, grade, required, prices, subject, address, callback) {
    validate(token, function success(user) {
        if (typeof prices[required] != 'object') {
            required = 'a';
        }
        db.all(util.format("select * from bids where teacher='%s' and subject='%s' and ((select subjects from teachers where username='%s') LIKE '%s') and grade=%d", user.username, subject, user.username, subject, grade), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    callback(null, stats.Exists);
                } else {
                    db.all(util.format("select addresses,subjects from teachers where username='%s'", user.username), function(err, rows) {
                        if (err)
                            callback(err, stats.Error);
                        else {
                            if (rows && rows.length > 0) {
                                var addresses = JSON.parse(rows[0].addresses);
                                var address_temp = addresses[address];
                                if (!address_temp) {
                                    callback(null, stats.InvalidData);
                                    return;
                                }
                                db.run(util.format("insert into bids (teacher,timetable,grade,required,prices,subject,address,address_temp,date) values ('%s','%s',%d,'%s','%s','%s',%d,'%s',%d)", user.username, JSON.stringify(timetable), grade, required, JSON.stringify(prices), subject, address, JSON.stringify(address_temp), date()), function(err) {
                                    if (err)
                                        callback(err, stats.Error);
                                    else
                                        callback(null, stats.OK);
                                });
                            } else callback(null, stats.UserNonExisting);
                        }
                    });

                }
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function genNumber(num) {
    return Math.floor(Math.random() * (Math.pow(10, num)));
}

function genCopoun(token, bid, limit, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from bids where teacher='%s' and id='%d'", user.username, bid), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    db.all(util.format("select id from copouns where bid='%d' and teacher='%s'", bid, user.username), function(err, rows) {
                        if (err)
                            callback(err, stats.Error);
                        else {
                            if (rows && rows.length > 0)
                                callback(null, stats.Exists);
                            else {
                                var code = genNumber(8);
                                db.run(util.format("insert into copouns (teacher,bid,code,`limit`,date) values ('%s','%d','%d','%d','%d')", user.username, bid, code, limit, date()), function(err) {
                                    if (err)
                                        callback(null, stats.Error);
                                    else
                                        callback(null, stats.OK, code);
                                });
                            }
                        }
                    })
                } else {
                    callback(null, stats.NonExisting);
                }
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function setBidState(token, bid, state, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from bids where teacher='%s' and bid=%d", user.username, bid), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    db.run(util.format("update bids set open=%d where bid=%d", state ? 1 : 0, bid), function(err) {
                        if (err)
                            callback(err, stats.Error);
                        else
                            callback(null, stats.OK);
                    });
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getBids(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select * from bids where teacher='%s'", targetuser), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                for (var key in rows) {
                    rows[key].prices = JSON.parse(rows[key].prices);
                    rows[key].timetable = JSON.parse(rows[key].timetable);
                }
                callback(null, stats.OK, rows);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getOrders(token, bid, callback) {
    validate(token, function success(user) {
        db.all(util.format("select * from orders where teacher='%s' and bid=%d", user.username, bid), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                callback(null, stats.OK, rows);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

//TODO test
function removeBid(token, id, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from teachers where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    var balance = user.balance;
                    db.all(util.format("select prices,subject,grade from bids where id=%d", id), function(err, rows) {
                        if (err)
                            callback(err, stats.Error);
                        else {
                            if (rows && rows.length > 0) {
                                var subject = rows[0].subject;
                                var grade = rows[0].grade;
                                var prices = [];
                                if (rows[0].prices)
                                    prices = rows[0].prices;
                                db.all(util.format("select * from orders where bid=%d", id), function(err, rows) {
                                    if (err)
                                        callback(err, stats.Error);
                                    else {
                                        if (rows && rows.length > 0) {
                                            var orderscount = orders.length;
                                            var finalprice = 0;
                                            var orders = rows;
                                            for (var i = 0; i < prices.length; i++) {
                                                finalprice += prices[i];
                                            }
                                            if (finalprice > 0) {
                                                var rtprice = 0;
                                                var usersrt = {};
                                                for (var orderkey in orders) {
                                                    if (orders.hasOwnProperty(orderkey)) {
                                                        var order = orders[orderkey]
                                                        var payed = JSON.parse(order.payed);
                                                        var fp = 0;
                                                        for (var i = 0; i < payed.length; i++) {
                                                            fp += prices[payed[i]];
                                                        }
                                                        usersrt[order.username] = {
                                                            price: fp,
                                                            orderid: order.id
                                                        };
                                                        rtprice += fp;
                                                    }
                                                }
                                                if (balance > rtprice) {
                                                    var gate = true;
                                                    var i = 0;
                                                    var rtm = 0;
                                                    var keys = Object.keys(usersrt);
                                                    while (gate) {
                                                        gate = false;
                                                        var rt = usersrt[keys[i++]];
                                                        rtm += rt.price;
                                                        db.run(util.format("insert into bidremoveorders (teacher,student,amount,notificationid,`data`,`date`,orderid) values ('%s','%s',%d,%d,%d,'%s',%d)", user.username, key, rt.price, notifications.BidRemoval, JSON.stringify({
                                                            subject: subject,
                                                            grade: grade,
                                                            teacher: user.username,
                                                            rtmoney: rt.price
                                                        }), date(), rt.orderid), function(err) {
                                                            if (err) {
                                                                if (err.code == 'SQLITE_CONSTRAINT')
                                                                    callback(null, stats.NoEnoughMoney, {
                                                                        rtm: rtm - rt.price,
                                                                        rtu: i - 1,
                                                                        rta: keys.length
                                                                    });
                                                                else
                                                                    callback(err, stats.Error, {
                                                                        rtm: rtm - rt.price,
                                                                        rtu: i - 1,
                                                                        rta: keys.length
                                                                    });
                                                            } else {
                                                                if (keys.length == i) {
                                                                    callback(null, stats.OK, {
                                                                        rtm: rtm - rt.price,
                                                                        rtu: i - 1,
                                                                        rta: keys.length
                                                                    });
                                                                } else gate = true;
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    callback(null, stats.NoEnoughMoney, {
                                                        balance: balance,
                                                        rtprice: rtprice,
                                                        count: orderscount
                                                    });
                                                }
                                            } else {
                                                db.run(util.format("delete from orders where bid=%d", id), function(err) {
                                                    if (err)
                                                        callback(err, stats.Error);
                                                    else {
                                                        db.run(util.format("delete from bids where id=%d and teacher='%s'", id, user.username), function(err) {
                                                            if (err) {
                                                                callback(err, stats.Error);
                                                                var shift = 0;
                                                                for (var orderkey in orders) {
                                                                    orderkey -= shift;
                                                                    if (object.hasOwnProperty(orderkey)) {
                                                                        var order = orders[orderkey];
                                                                        db.run(util.format("insert into orders (id,teacher,user,bid,payed,date) values (%d,'%s','%s',%d,'%s',%d)", order.id, order.teacher, order.user, order.bid, order.payed, order.date), function(err) {
                                                                            if (!err) {
                                                                                orders.splice(orderkey, 1);
                                                                                shift++;
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                                fs.writeFileSync("logs/removebids/" + date(), JSON.stringify({
                                                                    bid: id,
                                                                    user: user,
                                                                    count: orderscount,
                                                                    orders: orders,
                                                                    state: "free bids"
                                                                }));
                                                            } else {
                                                                callback(null, stats.OK);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        } else {
                                            db.run(util.format("delete from bids where id=%d and teacher='%s'", id, user.username), function(err) {
                                                if (err)
                                                    callback(err, stats.Error);
                                                else {
                                                    callback(null, stats.OK);
                                                }
                                            });
                                        }
                                    }
                                });
                            } else callback(null, stats.NonExisting);
                        }
                    });
                } else callback(err, stats.NotTeacher);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function difference(org, newed) {
    var changesint = 0;
    var sql = "";
    var changes = {};
    for (var key in newed) {
        if (newed.hasOwnProperty(key)) {
            if (org[key] != newed[key]) {
                if (changesint <= 0)
                    sql = util.format("%s = '%s'", key, newed[key]);
                else
                    sql += util.format(", %s = '%s'", key, newed[key]);
                changes[key] = {
                    old: org[key],
                    new: newed[key]
                };
                changesint++;
            }
        }
    }
    return {
        sql: sql,
        changes: changes
    };
}
//TODO test
function editBid(token, id, timetable, required, prices, grade, subject, address, callback) {
    validate(token, function success(user) {
        if (typeof prices[required] != 'number') {
            required = null;
        }
        db.all(util.format("select *, (select addresses from teachers where teacher='%s') as addresses from bids where teacher='%s' and id=%d", user.username, user.username, id), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    var finish = function() {
                        var bid = rows[0];
                        var addresses = JSON.parse(rows[0].addresses);
                        var address_temp = addresses[address];
                        if (!address_temp) {
                            callback(null, stats.InvalidData);
                            return;
                        }
                        var changes = difference(bid, {
                            timetable: JSON.stringify(timetable),
                            requried: requried,
                            prices: JSON.stringify(prices),
                            grade: grade,
                            subject: subject,
                            address: address,
                            address_temp: address_temp
                        });
                        db.run(util.format("update bids set %s where id=%d", changes.sql, id), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                callback(null, stats.OK);
                                db.run(util.format("insert into notifications ('username','action','data','date') select username, %d as 'action', '%s' as 'data', %d as 'date' from orders where bid=%d", notifications.BidEdit, JSON.stringify({
                                    subject: bid.subject,
                                    teacher: bid.teacher,
                                    changes: changes
                                }), date(), id));
                            }
                        });
                    };
                    if (grade != rows[0].grade) {
                        db.all(util.format("select id from bids where teacher='%s' and grade=%d", user.username, grade), function(err, rows) {
                            if (err)
                                callback(err, stats.Error);
                            else {
                                if (rows && rows.length > 0) callback(null, stats.Exists);
                                else finish();
                            }
                        });
                    } else finish();
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getTeacherProfile(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select username,(select displayname from users where username='%s') as displayname,(select tokens from users where username='%s') as tokens,addresses,bids,subjects,bio,allowTF,rate from teachers where username='%s'", targetuser, targetuser, targetuser), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    var returner = rows[0];
                    returner.bids = JSON.parse(returner.bids);
                    returner.subjects = JSON.parse(returner.subjects);
                    returner.addresses = JSON.parse(returner.addresses);
                    returner.phones = JSON.parse(user.phones);
                    returner.date = user.date;
                    if (targetuser == user.username) {
                        returner.sessions = {};
                        var tokens = JSON.parse(returner.tokens);
                        for (var vartoken in tokens) {
                            var tk = readToken(tokens[vartoken].token);
                            returner.sessions[vartoken] = tk.model;
                        }
                    }
                    returner.tokens = null;
                    db.all(util.format("select username,title,text,date from reviews where target='%s' order by id desc limit 3", targetuser), function(err, rows) {
                        if (err) console.log(err.stack);
                        returner.reviews = rows;
                        db.all(util.format("select username,title,text,date from reviews where target='%s' and username='%s'", targetuser, user.username), function(err, rows) {
                            if (err) console.log(err.stack);
                            if (rows) {
                                returner.review = rows[0];
                            }
                            db.all(util.format("select count(*) as count from rates where uni='%s'", user.username + targetuser), function(err, rows) {
                                if (err) console.log(err.stack);
                                if (rows) {
                                    returner.ratescount = rows[0].count;
                                }
                                callback(null, stats.OK, returner);
                                db.run(util.format("insert into notifications (username,`action`,`data`,date) values ('%s',%d,1,%d)", targetuser, notifications.ProfileView, date()));
                            });
                        });
                    });
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getSubjectName(id, callback) {
    db.all(util.format("select name,alternative_name from subjects where id='%d'", id), function(err, rows) {
        if (rows && rows.length > 0) {
            callback(rows[0]);
        } else return null;
    });
}

function getSubjectsNames(ids, callback) {
    db.all(util.format("select * from subjects where id in (%s)", ids.join(',')), function(err, rows) {
        if (rows && rows.length > 0) {
            callback(rows);
        } else return null;
    });
}

function addSubject(token, subject, callback) {
    validate(token, function success(user) {
        db.all(util.format("select subjects from teachers where username='%s'", user.username), function(err, rows) {
            if (rows && rows.length > 0) {
                var subjects = [];
                if (rows[0].subjects)
                    subjects = JSON.parse(rows[0].subjects);
                if (subjects.indexOf(subject) > -1) {
                    getSubjectsNames(subjects, function(sns) {
                        callback(null, stats.Exists, sns);
                    });
                } else {
                    getSubjectName(subject, function(name) {
                        if (name) {
                            subjects.push(subject);
                            db.run(util.format("update teachers set subjects='%s' where username='%s'", JSON.stringify(subjects), user.username), function(err) {
                                if (err)
                                    callback(null, stats.Error);
                                else {
                                    getSubjectsNames(subjects, function(sns) {
                                        callback(null, stats.OK, sns);
                                    });
                                }
                            });
                        } else callback(null, stats.InvalidData)
                    });
                }
            } else callback(null, stats.NonExisting);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function removeSubject(token, id, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from bids where subject=%d and teacher='%s'", id, user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    callback(null, stats.Associated, rows);
                } else {
                    db.all(util.format("select subjects from teachers where username='%s'", user.username), function(err, rows) {
                        if (err)
                            callback(err, stats.Error);
                        else {
                            if (rows && rows.length > 0) {
                                var subjects = [];
                                if (rows[0].subjects)
                                    subjects = JSON.parse(rows[0].subjects);
                                var index = subjects.indexOf(id);
                                if (index > -1) {
                                    subjects.splice(index, 1);
                                    db.run(util.format("update teachers set subjects='%s' where username='%s'", JSON.stringify(subjects), user.username), function(err) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else {
                                            getSubjectsNames(subjects, function(sns) {
                                                callback(null, stats.OK, sns);
                                            });
                                        }
                                    });
                                } else callback(null, stats.NonExisting);
                            } else callback(null, stats.UserNonExisting);
                        }
                    });
                }
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getSubjects(token, callback) {
    validate(token, function success(user) {
        db.all(util.format("select subjects from teachers where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    var subjects = {};
                    if (rows[0].subjects)
                        subjects = JSON.parse(rows[0].subjects);
                    getSubjectsNames(subjects, function(sns) {
                        callback(null, stats.OK, sns);
                    });
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editDisplayname(token, displayname, callback) {
    validate(token, function success(user) {
        db.run(util.format("update users set displayname='%s' where username='%s'", displayname, user.username), function(err) {
            if (err)
                callback(err, stats.Error);
            else
                callback(err, stats.OK);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function updateBio(token, bio, callback) {
    validate(token, function success(user) {
        db.run(util.format("update teachers set bio='%s' where username='%s'", bio, user.username), function(err) {
            if (err)
                callback(err, stats.Error);
            else
                callback(err, stats.OK);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getBio(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select bio from teachers where username='%s'", targetuser), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        callback(null, stats.OK, rows[0].bio);
                    } else callback(null, stats.UserNonExisting);
                } else callback(null, stats.UserNonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getReviews(token, limit, targetuser, id, dir, callback) {
    validate(token, function success(user) {
        var sql = '';
        if (id) {
            if (dir == -1)
                sql = util.format("select username,title,text,date from reviews where target='%s' and id < %d order by id desc limit %d", targetuser, id, limit);
            else if (dir == 1)
                sql = util.format("select username,title,text,date from reviews where target='%s' and id > %d order by id desc limit %d", targetuser, id, limit);
            else {
                callback(null, stats.InvalidToken);
                return;
            }
        } else
            sql = util.format("select username,title,text,date from reviews where target='%s' order by id desc limit %d", targetuser, limit);
        console.log(sql);
        db.all(sql, function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows)
                    callback(null, stats.OK, rows);
                else
                    callback(null, stats.OK, null);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function review(token, text, title, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from students where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        db.run(util.format("insert or replace into reviews ('username','text','title','target','date','uni') values ('%s','%s','%s','%s','%s',(select uni from reviews where username='%s' and target='%s'))", user.username, text, title, targetuser, date(), user.username, targetuser), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NotStudent);
                } else callback(null, stats.NotStudent);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function unreview(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from reviews where target='%s' and username='%s'", targetuser, user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        db.run(util.format("delete from reviews where id='%s'", rows[0].id), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NonExisting);
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function rate(token, value, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from students where username='%s'", user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        db.run(util.format("insert or replace into rates ('username','value','target','date','uni') values ('%s','%s','%s','%s',(select uni from rates where username='%s' and target='%s'))", user.username, value, targetuser, date(), user.username, targetuser), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NotStudent);
                } else callback(null, stats.NotStudent);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function unrate(token, targetuser, callback) {
    validate(token, function success(user) {
        db.all(util.format("select id from rates where target='%s' and username='%s'", targetuser, user.username), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows) {
                    if (rows.length > 0) {
                        db.run(util.format("delete from rates where id='%s'", rows[0].id), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NonExisting);
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getMediaInfo(token, id, callback) {
    validate(token, function success(user) {
        db.all(util.format("select user,checksum,size,type,date from media where id=%d and completed=1", id), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows.length >= 1) {
                    var path = getPath(id);
                    if (rows[0].checksum == md5.sync(path))
                        callback(null, stats.OK, rows[0]);
                    else callback(null, stats.MediaNotFound);
                } else callback(null, stats.MediaNotFound);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function getMedia(token, id, range, callback) {
    validate(token, function success(user) {
        db.all(util.format("select checksum,size from media where id='%s' and completed=1", id), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows.length >= 1) {
                    var path = getPath(id);
                    if (rows[0].checksum == md5.sync(path)) {
                        var stream = fs.createReadStream(path, {
                            start: range.start,
                            end: range.end
                        });
                        callback(null, stats.OK, stream);
                    } else {
                        callback(null, stats.MediaNotFound);
                    }
                } else {
                    callback(null, stats.MediaNotFound);
                }
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function prepareUpload(token, checksum, size, type, callback) {
    validate(token, function success(user) {
        db.run(util.format("insert into media (user, checksum, size, type, date) values ('%s','%s',%d,%d,%d)", user.username, checksum, size, type, date()), function(err) {
            if (err)
                callback(err, stats.Error);
            else
                callback(null, stats.OK, this.lastID);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function continueUpload(token, id, checksum, callback) {
    validate(token, function success(user) {
        db.all(util.format("select user,completed,checksum from media where id='%s'", id), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows.length == 1) {
                    if (rows[0].completed == 1)
                        callback(null, stats.AlreadyUploaded);
                    else if (rows[0].user != user.username) {
                        callback(null, stats.NoPermissions);
                    } else if (rows[0].checksum != checksum) {
                        callback(null, stats.ChecksumDontMatch);
                    } else {
                        callback(null, stats.OK, filesize(getPath(id)).toString());
                    }
                } else
                    callback(null, stats.MediaNotFound);
            }
        });
    });
}

function upload(token, id, checksum, range, buffer, callback) {
    validate(token, function success(user) {
        db.all(util.format("select user,size,completed,checksum from media where id='%s'", id), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows.length == 1) {
                    if (rows[0].completed == 1)
                        callback(null, stats.AlreadyUploaded);
                    else if (rows[0].user != user.username) {
                        callback(null, stats.NoPermissions);
                    } else if (rows[0].checksum != checksum) {
                        callback(null, stats.ChecksumDontMatch);
                    } else {
                        var path = getPath(id);
                        var size = filesize(path);
                        buffer = Buffer.from(buffer, "base64");
                        if (size == range.start && (range.end - range.start) == buffer.length) {
                            try {
                                fs.appendFileSync(path, buffer);
                                size = filesize(path);
                                if (range.end == size) {
                                    if (md5.sync(path) == checksum)
                                        db.run(util.format("update media set completed=1 where id='%s'", id), function(err) {
                                            if (err)
                                                callback(err, stats.Error);
                                            else
                                                callback(null, stats.UploadCompleted);
                                        });
                                    else callback(null, stats.UploadFailed);
                                } else callback(null, stats.Continue, range.end.toString());
                            } catch (e) {
                                callback(e, stats.Error);
                            }
                        } else callback(null, stats.RangesDontMatch, size.toString());
                    }
                } else callback(null, stats.MediaNotFound);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function post(token, text, mediaid, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select id from media where id='%s' and completed=1", mediaid), function(err, rows) {
            if (err)
                callback(stats.Error);
            else {
                if (rows && rows.length == 1) {
                    db.run(util.format("insert into posts (user, text, mediaid, date) values ('%s','%s',%d,%d)", user.username, text, mediaid, date()), function(err) {
                        if (err)
                            callback(err, stats.Error);
                        else
                            callback(null, stats.OK);
                    });
                } else callback(stats.MediaNotFound);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function editPost(token, id, text, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select username,edithistory,text,date from posts where id=%d", id), function(err, rows) {
            if (err)
                callback(stats.Error);
            else {
                if (rows && rows.length == 1) {
                    if (user.username == rows[0].username) {
                        var edithistory = {};
                        if (rows[0].edithistory) {
                            edithistory = rows[0].edithistory;
                            var newindex = edithistory.length;
                            while (edithistory[newindex])
                                newindex += 1;
                            edithistory[newindex] = {
                                text: text,
                                date: date()
                            };
                        } else {
                            edithistory[0] = {
                                text: rows[0].text,
                                date: rows[0].date
                            };
                            edithistory[1] = {
                                text: text,
                                date: date()
                            };
                        }
                        db.run(util.format("update posts set text='%s',edithistory='%s' where id=%d", text, JSON.stringify(edithistory), id), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NoPermissions);
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function removePost(token, id, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select id from posts where id=%d", id), function(err, rows) {
            if (err)
                callback(stats.Error);
            else {
                if (rows && rows.length == 1) {
                    if (user.username == rows[0].username) {
                        db.run(util.format("delete from posts where id=%d", id), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    } else callback(null, stats.NoPermissions);
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO
function getFeed(token, lastdate, callback) {
    validate(token, function success(user) {

    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
/*

+ = info
X = removed

- category
- limit
- keywords

teachers
---------
- subject
* keywords (display,username,bio,email,phones,addresses)

bids
---------
- subject
- grade (+)
- openOnly
- prices : range
* keywords (teacher)

*/
/*TODO

type: subscription / attachments
payment: half / full / class / weakly / monthly

course (el demairy)
----------
required: 0
prices: {
    0: {
        "type": "subscription",
        "payment":"half",
        "money":250
    }
}
----------
usual
----------
required: 1
prices: {
    0: {
        "type": "subscription",
        "payment":"monthly",
        "money":60
    }
    1: {
        "type": "attachments",
        "payment":"full",
        "money":70
    }
}
----------
free start
----------
required: a
prices: {
    0: {
        "type": "subscription",
        "payment":"monthly",
        "money":60
    }
}

*/
var priceType = {
    Subscription: "subscription",
    Attachments: "attachments"
}
var paymentQuan = {
    Class: "class",
    Monthly: "monthly",
    Half: "half",
    Full: "full"
}
//TODO test
function search(token, settings, category, callback) {
    validate(token, function success(user) {
            try {
                switch (category) {
                    case searchCategories.Teachers:
                        //var teacher_selector = compile('select users.username,subjects,profilepic,displayname,bio,rate from users inner join teachers on users.username = teachers.username where type="teachers" and (displayname LIKE "%{0}%" or users.username LIKE "%{0}%" or email LIKE "%{0}%" or phones LIKE "%{0}%" or addresses LIKE "%{0}%" or bio LIKE "%{0}%") and subjects LIKE "%{1}%"');
                        var limiter = compile(" LIMIT {0},{1}");
                        if (!settings.limit_s && !settings.limit_e) {
                            settings.limit_s = 0;
                            settings.limit_e = 10;
                        } else if (!settings.limit_s && settings.limit_e)
                            settings.limit_s = 0;
                        else if (settings.limit_s && !settings.limit_e)
                            settings.limit_e = settings.limit_s + 10;
                        if (settings.keywords.length <= 1) {
                            db.all(teacher_selector(settings.keywords[0], settings.subject) + " order by rate" + limiter(settings.limit_s, settings.limit_e), function(err, rows) {
                                if (err)
                                    callback(err, stats.Error);
                                else
                                    callback(null, stats.OK, {
                                        data: rows,
                                        last: settings.limit_s + rows.length
                                    });
                            });
                        } else {
                            var query = "";
                            for (var key in settings.keywords) {
                                var keyword = settings.keywords[key];
                                if (query == "") {
                                    query = teacher_selector(keyword, settings.subject);
                                } else {
                                    query += " union " + teacher_selector(keyword, settings.subject);
                                }
                            }
                            query += limiter(settings.limit_s, settings.limit_e);
                            db.all("select * from (" + query + ") order by rate", function(err, rows) {
                                if (err)
                                    callback(err, stats.Error);
                                else
                                    callback(null, stats.OK, {
                                        data: rows,
                                        last: settings.limit_s + rows.length
                                    });
                            });
                        }
                        break;
                    case searchCategories.Bids:
                        //TODO suitable for his timetable or not
                        //TODO prices
                        var bid_selector = compile('select users.username,profilepic,displayname,rate,subject,open,required,prices from users inner join teachers on users.username = teachers.username inner join bids on teachers.username = bids.teacher where open = 1 or open = {2} and grade LIKE "%{3}%" and (displayname LIKE "%{0}%" or users.username LIKE "%{0}%" or email LIKE "%{0}%" or phones LIKE "%{0}%" or address_temp LIKE "%{0}%" or bio LIKE "%{0}%") and subject LIKE "%{1}%" and (subjects LIKE "%{1}%")');
                        var limiter = compile(" LIMIT {0},{1}");
                        if (!settings.limit_s && !settings.limit_e) {
                            settings.limit_s = 0;
                            settings.limit_e = 10;
                        } else if (!settings.limit_s && settings.limit_e)
                            settings.limit_s = 0;
                        else if (settings.limit_s && !settings.limit_e)
                            settings.limit_e = settings.limit_s + 10;
                        if (!settings.grade) {
                            db.all(util.format("select grade from students where username='%s'", user.username), function(err, rows) {
                                if (err)
                                    callback(err, stats.Error);
                                else {
                                    if (rows && rows.length == 1) {
                                        settings.grade = rows[0].grade;
                                        continueWork();
                                    } else callback(null, stats.UserNonExisting)
                                }
                            });
                        } else continueWork();
                        var continueWork = function() {
                            if (settings.keywords.length <= 1) {
                                db.all(bid_selector(settings.keywords[0], settings.subject, settings.openOnly, settings.grade) + " order by rate" + limiter(settings.limit_s, settings.limit_e), function(err, rows) {
                                    if (err)
                                        callback(err, stats.Error);
                                    else
                                        callback(null, stats.OK, {
                                            data: rows,
                                            last: settings.limit_s + rows.length
                                        });
                                });
                            } else {
                                var query = "";
                                for (var key in settings.keywords) {
                                    var keyword = settings.keywords[key];
                                    if (query == "") {
                                        query = bid_selector(keyword, settings.subject, settings.openOnly, settings.grade);
                                    } else {
                                        query += " union " + bid_selector(keyword, settings.subject, settings.openOnly, settings.grade);
                                    }
                                    query += limiter(settings.limit_s, settings.limit_e);
                                    db.all("select * from (" + query + ") order by rate", function(err, rows) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else
                                            callback(null, stats.OK, {
                                                data: rows,
                                                last: settings.limit_s + rows.length
                                            });
                                    });
                                }
                            }
                        }
                        break;
                    default:
                        callback(null, stats.InvalidData);
                        break;
                }
            } catch (e) {
                callback(e, stats.Error);
            }
        },
        function failure() {
            callback(null, stats.InvalidToken);
        });
}
//TODO test
function follow(token, targetuser, copoun, callback) {
    validate(token, function success(user) {
        db.all(util.format("select allowTF from teachers where username='%d'", targetuser), function(rows, err) {
            if (err)
                callback(stats.Error);
            else {
                var allowTF = rows[0].allowTF;
                if (rows && rows.length >= 0) {
                    db.all(util.format("select id from orders where user='%s' and teacher='%s'", user.username, targetuser), function(rows, err) {
                        if (rows && rows.length >= 0) {
                            db.run(util.format("insert or replace into follows (follower,followed,`date`) values ('%s','%s',COALESCE((select `date` from follows where follower='%s' and followed='%d'), %d))", user.username, targetuser, user.username, targetuser, date()), function(err) {
                                if (err)
                                    callback(err, stats.Error);
                                else
                                    callback(null, stats.OK);
                            });
                        } else {
                            if (copoun) {
                                db.all(util.format("select limit,used,bid from copouns where code='%d'", copoun), function(rows, err) {
                                    if (err)
                                        callback(stats.Error);
                                    else {
                                        if (user.type == "teachers") {
                                            if (allowTF) {
                                                db.run(util.format("insert or replace into follows (follower,followed,`date`) values ('%s','%s',COALESCE((select `date` from follows where follower='%s' and followed='%d'), %d))", user.username, targetuser, user.username, targetuser, date()), function(err) {
                                                    if (err)
                                                        callback(err, stats.Error);
                                                    else
                                                        callback(null, stats.OK);
                                                });
                                            } else callback(null, stats.NoPermissions);
                                        } else {
                                            db.run(util.format("insert or replace into follows (follower,followed,`date`) values ('%s','%s',COALESCE((select `date` from follows where follower='%s' and followed='%d'), %d))", user.username, targetuser, user.username, targetuser, date()), function(err) {
                                                if (err)
                                                    callback(err, stats.Error);
                                                else
                                                    callback(null, stats.OK);
                                            });
                                        }
                                    }
                                });
                            } else callback(null, stats.NoPermissions);
                        }
                    });
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function setTF(token, val, callback) {
    validate(token, function success(user) {
        console.log(user);
        db.run(util.format("update teachers set allowTF='%d' where username='%s'", val, user.username), function(err) {
            if (err)
                callback(err, stats.Error);
            else
                callback(null, stats.OK);
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function impress(token, postid, emoticon, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select id from posts where id=%d", id), function(err, rows) {
            if (err)
                callback(stats.Error);
            else {
                if (rows && rows.length >= 1) {
                    db.run(util.format("insert into impresses (username,emoticon,postid) values ('%s',%d,%d)", user.username, emoticon, postid), function(err) {
                        if (err)
                            callback(err, stats.Error);
                        else
                            callback(null, stats.OK);
                    });
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

function comment(token, postid, text, mediaid, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select id from posts where id=%d", id), function(err, rows) {
            if (err)
                callback(stats.Error);
            else {
                if (rows && rows.length >= 1) {
                    if (mediaid) {
                        db.all(util.format("select id from media where id='%s' and completed=1", mediaid), function(err, rows) {
                            if (err)
                                callback(stats.Error);
                            else {
                                if (rows && rows.length == 1) {
                                    db.run(util.format("insert into comments (username,text,mediaid,postid) values ('%s','%s',%d,%d)", user.username, text, mediaid, postid), function(err) {
                                        if (err)
                                            callback(err, stats.Error);
                                        else
                                            callback(null, stats.OK);
                                    });
                                } else callback(null, stats.MediaNotFound);
                            }
                        });
                    } else {
                        db.run(util.format("insert into comments (username,text,postid) values ('%s','%s',%d)", user.username, text, postid), function(err) {
                            if (err)
                                callback(err, stats.Error);
                            else
                                callback(null, stats.OK);
                        });
                    }
                } else callback(null, stats.NonExisting);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}
//TODO test
function getNotifications(token, lastid, limit, calllback) {
    validate(token, function success(user) {
        db.all(util.format("select * from notifications where username='%s' and seen=0 and id > %d limit %d; update notifications set seen=1 where id=(select id from notifications where username='%s' and seen=0 and id > %d limit %d);", user.username, lastid, limit, user.username, lastid, limit), function(err, rows) {
            if (err)
                callback(err, stats.Error);
            else {
                if (rows && rows.length > 0) {
                    callback(null, stats.OK, rows);
                } else
                    callback(null, stats.UpToDate);
            }
        });
    }, function failure() {
        callback(null, stats.InvalidToken);
    });
}

module.exports = {
    Authorize: authorize,
    DeAuthorize: deAuthorize,
    GetToken: getTokens,
    Register: register,
    GetTokens: getTokens,
    AddAddress: addAddress,
    EditAddress: editAddress,
    RemoveAddress: removeAddress,
    GetAddresses: getAddresses,
    AddPhone: addPhone,
    EditPhone: editPhone,
    RemovePhone: removePhone,
    GetPhones: getPhones,
    AddSubject: addSubject,
    RemoveSubject: removeSubject,
    GetSubjects: getSubjects,
    GetIntro: getIntro,
    GetTeacherProfile: getTeacherProfile,
    UpdateBio: updateBio,
    GetBio: getBio,
    EditAutoReturn: editAutoReturn,
    Review: review,
    GetReviews: getReviews,
    UnReview: unreview,
    Rate: rate,
    UnRate: unrate,
    Bid: bid,
    GetBids: getBids,
    RemoveBid: removeBid,
    EditBid: editBid,
    Order: order,
    ReturnOrder: returnOrder,
    ApproveReturnOrder: approveReturnOrder,
    CancelReturnOrder: cancelReturnOrder,
    CheckToken: checkToken,
    GetNotifications: getNotifications,
    ValidateEmail: validateEmail,
    EditDisplayname: editDisplayname,
    GenerateCopoun: genCopoun,
    Upload: upload,
    PrepareUpload: prepareUpload,
    ContinueUpload: continueUpload,
    GetMediaInfo: getMediaInfo,
    GetMedia: getMedia,
    EditProfilePicture: editProfilePicture,
    SetTF: setTF,
    Search: search,
    /* PUBLIC SHARED SERVER CONST */
    stats: stats
};
