const express = require('express');
const app = express();
const dotenv = require('dotenv');
const twilio = require('twilio');

const cfg = {};

dotenv.config({ path: '.env' });

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

const port = process.env.PORT || 3000;

const requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
const isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  const errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}
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

app.listen(port, function() {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
