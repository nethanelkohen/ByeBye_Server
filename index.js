// Include the server in your file
const server = require('server');
const { get, post } = server.router;
const twilio = require('twilio');

// Handle requests to the url "/" ( http://localhost:3000/ )
server([get('/', ctx => 'Hello world!')]);

const client = new twilio(
  'AC75c566556818b97fe8eb0c098cdbca9e',
  '8264910fda8a56711219d5231b5fd185'
);

client.messages.create({
  to: '9176075745',
  from: '2015080050',
  body: 'Uhhhh bye bye'
});

client.messages.create({
  to: '9176075745',
  from: '2015080050',
  body: 'Uhhhh bye bye2'
});

client.messages.create({
  to: '9176075745',
  from: '2015080050',
  body: 'Uhhhh bye bye3'
});

