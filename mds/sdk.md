# Javascript SDK
## Getting Started

To use the SDK with angular you must inclue `sdk.js` in your html file
```html
<head>
    ...
    <script src="./assets/js/sdk.js"></script>
    ...
</head>
```
In order to be able to call SDK functions you must include `coretrix.sdk` in your angular dependencies
```js
...
var app = angular.module("...", ['coretrix.sdk'])
...
```
You can call a function from the SDK like this...
Take the `Authorize` function for example
```js
.controller("...", function($scope, coretrixSdk, ...) {
    var stats = coretrixSdk.stats;
    coretrixSdk.Authorize('[username]', '[password]', '[device]', '[model]', (stat, result) => {
        switch (stat) {
            case stats.OK:
                ...
            break;
            case stats.Error:
            default:
                ...
        }
    })
})
```

## Naming Rules

Naming rules are applied to the `fullname` argument

- يجب على الاسم ان يكون رباعياً او اكثر
- ممنوع استخدام حرف ال `ذ` و يجب استخدام ال `ز` بدلا منه مثل ( ذياد ، ذينب ) تصبح ( زياد ، زينب )
- يجب على الاسماء المركبه ان تكتب كاملةً
- ممنوع استخدام التاء المربوطه `ة` و تبدل بهاء `ه `
- ممنوع استخدام الهمزات مع الألف مثل `أ ، إ ، آ`
- ممنوع استخدام الشده ` ّ `
- ممنوع وضع لفظ الجلاله بعد الاسم مثل `منه الله ، و غيره`
- ممنوع استخدام حرف الياء فى نهايه الاسم مثل `صبري ، حمدي ، و غيره` و يجب ان تكون `صبرى ، حمدى ، الى اخره`
- يجب على الاسامى  اللى بها اسم من اسماء الله الحسنى ان تكون على هذه الهيئه `عبد الرحمن` و ليس `عبدالرحمن`

## SDK Functions
- Note that arguments are in order with the sdk functions
- Note that `stats.OK`, `stats.Error`, `stats.InvalidData` are constant and are ignored in the following table
- Note that `[] in arguments means optional`. `[] in Returned Data means array` and `{} means object`
#
Function | Description | Arguments | Stat Codes | Returned Data
| - | :-: | :-: | :-: | :-: |
Register | Register New Account | displayname, username, password, email, usertype, callback | Exists | [ isEmailDuplicate, isUsernameDuplicate ]
Authorize | Generate Token | username, password, device, model, callback | WrongPassword, UserNonExisting | token, unique, usertype, username
isAlive | Check Token | token, callback | - |  username, usertype
GetTokens | Get Active Tokens | token, callback | UserNonExisting |  tokens: [ { device: { device, model }, unique }]
Deauthorize | Deauthorize Token | unique, token, callback | - |  [null]
AddPhone | Add Phone | phonecode, number, token, callback | Exists (in current user's phones), Used (by another user) |  [null]
GetPhones | Get Phone(s) | token, callback, [ids], [startid], [limit] | - |  [ { id, phonecode, number } ]
RemovePhone | Remove Phone(s) | d_ids, token, callback | - |  -

## Arguments
#
Argument | Description | Type | Possible Values | Notes
| - | :-: | :-: | :-: | :-: |
callback | Callback(stat, result) | Function | --- | SDK Function return no data.. Use callbacks instead
displayname | Displayed Name | string | --- | Showen to other users, Can be changed
username | Account Username | string | --- | Cannot be shown to other users, Cannot be changed
passowrd | Account Passowrd | string | Needs to be longer than 8 characters | ---
email | Account Email | string | --- | ---
usertype | Account Type | string | student/teacher | ---
login | Username or Email | string | --- | ---
device | Platform | string | web/android/ios/desktop | ---
model | Device Info | object | --- | Needs to be queryable to be able to analyize it
token | Authorization Token | string | --- | ---
unique | Token's unique | number | --- | Used to deauthorize certain tokens
phonecode | Area's Phone Code | phonecode (string) | 010, 011, 012, 045, ... | Check out Phone Codes in [Constants] [constants] to learn more
number | Phone Number | number (string) | --- | Number but sent as a string to avoid losing any `zeros`
startid | Id to continue listing after | number | --- | ---
limit | Elements per request | number | --- | ---
ids | Array of ids | array [number] | --- | ---
d_ids | Ids to be deleted | array [number] | --- | List of Ids to delete
name | Name | string | --- | ---
coordinates | Latitude, longitude without white spaces | coordinates (string) | --- | Best leave it to Maps service as the Latitude is limited between -90 - 90 and Longitude is limited between -180 - 180
address | Written Address | string | --- | If [null] coordinates will be converted to a written address using Google Maps
phones | Array of User's Phones' Ids | array [number] | --- | ---
addresstype | Type of the added Address | string | home, center | ---

[constants]: <constants.md>
