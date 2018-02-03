// Import express.js.
const express = require('express');
// Instantiate express.
const app = express();
// Import dotenv for .env configuration.
const dotenv = require('dotenv');
// Import path for file and directory paths.
const path = require('path');
// Import bodyParser to parse through json objects.
const bodyParser = require('body-parser');
// Import twilio for Twilio API call.
const twilio = require('twilio');

// Cache cfg for env variables.
const cfg = {};
// Instantiate bodyParser.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// Path config to .env directory.
dotenv.config({ path: '.env' });

// Create variables holding config variables.
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

// Create new Twilio instance with cfg details.
const client = new twilio(cfg.accountSid, cfg.authToken);

const requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
const isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

// Handles error.
if (!isConfigured) {
  const errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}

// Simple Get request to make sure server is running.
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Handles Post request from user.
app.post('/message', (req, res) => {
  console.log('REQUEST ', req);
  // Takes in recipient's phone number and message body.
  let toNumber = req.body.contact,
    message = req.body.message;

// Create user's message.
  client.messages.create(
    {
      to: toNumber,
      from: cfg.sendingNumber,
      body: message
    },
    // Handles error.
    (err, apiResponse) => {
      if (err) {
        console.error('There was an error making the text: ', err);
      }
      // Sets content type.
      res.set('Content-Type', 'application/xml');
      res.send('<Response/>');
    }
  );
});

// Sets server port.
const port = process.env.PORT || 3000;

// Server listens on port and sets .env variables.
app.listen(port, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    port,
    app.settings.env
  );
});
