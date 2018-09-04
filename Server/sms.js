var accountSid = 'AC9084fab4722fc541f994d1df778f9c20';
var authToken = '06b00e55afb02a7221ba41ebf250c781';

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'هذه الرساله من برنامج الكورتركس الدولى و حياتك فى خطر لانك بائس و بجرب هذا الشىء الرساله بجنيه و ربع يريق',
    to: '+201210313171',  // Text this number
    from: '+19153205427' // From a valid Twilio number
})
.then((message) => console.log(message));
