const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cfg = {};

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example', silent: true });
}

cfg.accountSid = 'AC75c566556818b97fe8eb0c098cdbca9e';
cfg.authToken = '8264910fda8a56711219d5231b5fd185';
cfg.sendingNumber = '+12015080050';

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
const client = new twilio(cfg.accountSid, cfg.authToken);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/byebye', function(req, res) {
  client.messages
    .create({
      body: 'Hello from Node',
      to: '+19176075745',
      from: cfg.sendingNumber
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
