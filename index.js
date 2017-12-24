const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cfg = {};

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example', silent: true });
}

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

const requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
const isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  const errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}

const twilio = require('twilio');
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/byebye', function(req, res) {
  client.messages
    .create({
      body: 'Hello from Node',
      to: '+19176075745',
      from: process.env.TWILIO_NUMBER
    })
    .then(message => console.log(message.sid))
    .then(res.send('Message sent'));
});

app.listen(process.env.PORT || 3000, function() {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
