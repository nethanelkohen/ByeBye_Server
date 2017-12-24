var config = require('./config/config');
var client = require('twilio')(config.accountSid, config.authToken);

// To send a message using Twilio REST api, three parameters are required: body, to, from.
module.exports.sendSms = function(to, message) {
  client.messages.create(
    {
      body: message,
      to: to,
      from: config.sendingNumber
    },
    function(err, data) {
      if (err) {
        console.error('Could not notify admin');
        console.error('err');
      } else {
        console.log('Admin notified');
      }
    }
  );
};
