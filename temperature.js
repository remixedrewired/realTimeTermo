var pubnub = require('pubnub')({
  publish_key: 'pub-c-073d8746-d2e5-492b-9ed5-66a40f6b561f',
  subscribe_key: 'sub-c-70085a74-8131-11e6-a8c4-0619f8945a4f'
});

var channel = 'temperature-ds18b20';

var temp = 0;

function publish() {
  var data = {
    'temperature': temp,
    'tempf': tempinf
  };
  pubnub.publish({
    channel: channel,
    message: data,
  });
}

var five = require('johnny-five');

five.Board().on('ready', function() {
  var temperature = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2
  });

  temperature.on('data', function() {
    console.log(this.celsius + '°C', this.fahrenheit + '°F');
    temp = this.celsius;
    tempinf = this.fahrenheit;
  });

  setInterval(publish, 2000);
});
