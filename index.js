const express = require('express');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const request = require('request');
const morgan = require('morgan');
// const authToken = process.env.AUTH_TOKEN;
// const accountSID = process.env.ACCOUNT_SID;
// const fromNumber = process.env.FROM_PHONE;
const cfg = {};
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
dotenv.config({ path: '.env' });

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

const client = new twilio(cfg.accountSid, cfg.authToken);

const requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
const isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  const errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/byebye', (req, res) => {
  client.messages
    .create({
      body: 'Hello from Node',
      to: '+19176075745',
      from: cfg.sendingNumber
    })
    .then(message => console.log(message.sid))
    .then(res.send('Message sent'));
});

app.post('/message', (req, res) => {
  console.log('REQUEST ', req);
  let toNumber = req.body.contact,
    message = req.body.message;

  client.messages.create(
    {
      to: toNumber,
      from: fromNumber,
      body: message
    },
    (err, message) => {
      if (err) throw err;
      else console.log(message);
    }
  );
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    port,
    app.settings.env
  );
});
