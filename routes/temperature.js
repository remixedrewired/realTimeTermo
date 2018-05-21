const pubnub = require('pubnub')({
  publish_key: 'pub-c-1a33e74f-10fe-45ad-b6b4-f2dda25251c6',
  subscribe_key: 'sub-c-ebe2b4f8-2506-11e8-bb29-5a43d096f02f'
});
const channel = 'temperature-ds18b20';
const five = require('johnny-five');

let temp = 0;
let light = 0;
let tempinf = 0;

function publish() {
  let data = {
    'temperature': temp,
    'tempf': tempinf,
    'light': light
  };
  pubnub.publish({
    channel: channel,
    message: data,
  });
}

five.Board().on('ready', () => {
  const temperature = new five.Thermometer({
    controller: 'DS18B20',
    pin: 12, 
    freq: 1000
  });
  const photoresistor = new five.Sensor({
    pin: 'A1',
    freq: 1000
  });
  let temptoscreen = '';

  temperature.on('data', (e) => {
    console.log(e.celsius + '°C', e.fahrenheit + '°F');
    temp = e.celsius;
    tempinf = e.fahrenheit;
    temptoscreen = temp ;
  });

  five.Board().repl.inject({
    pot: photoresistor
  });

  photoresistor.on('data', (e) => {
    console.log('photoresistor: ' + e);
    light = e / 15;
  });

  setInterval(publish, 1000);
});
