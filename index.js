const express = require('express');
const app = express();
const config = require('./config');
const port = process.env.PORT || 3000;

const twilio = require('twilio');
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/byebye', function(req, res) {
  client.messages
    .create({
      body: 'Hello from Node',
      to: '+19176075745',
      from: process.env.TWILIO_NUMBER
    })
    .then(message => console.log(message.sid))
    .then(res.send('Message sent'));
});

console.log('listening on', port);
app.listen(port);
