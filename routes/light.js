var five = require('johnny-five');

var pubnub = require('pubnub')({
  publish_key: 'pub-c-073d8746-d2e5-492b-9ed5-66a40f6b561f',
  subscribe_key: 'sub-c-70085a74-8131-11e6-a8c4-0619f8945a4f'
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
    pin: 'A2',
    freq: 250
  });


  photoresistor.on('data', function() {
    console.log('photoresistor: ' + this.value);
    light = this.value;
  });

  setInterval(publish, 1000);
});
