var five = require('johnny-five');

var pubnub = require('pubnub')({
  publish_key: 'pub-c-1a33e74f-10fe-45ad-b6b4-f2dda25251c6',
  subscribe_key: 'sub-c-ebe2b4f8-2506-11e8-bb29-5a43d096f02f'
});

var channel = 'lightsensor';

var light = 0;

function publish() {
  var data = {

    'light': light
  };
  pubnub.publish({
    channel: channel,
    message: data,
  });
}


five.Board().on('ready', function() {

  photoresistor = new five.Sensor({
    pin: 'A7',
    freq: 250
  });


  photoresistor.on('data', function() {
    console.log('photoresistor: ' + this.value);
    light = this.value;
  });

  setInterval(publish, 1000);
});
