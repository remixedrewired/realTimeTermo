const pubnub = require('pubnub')
const PubNub = new pubnub({
  publish_key: 'pub-c-1a33e74f-10fe-45ad-b6b4-f2dda25251c6',
  subscribe_key: 'sub-c-ebe2b4f8-2506-11e8-bb29-5a43d096f02f'
});
const channel = 'temperature-ds18b20';
const five = require('johnny-five');
const board = new five.Board();

let temp = 0;
let humidity = 0;
let tempinf = 0;

function publish() {
  let data = {
    'temperature': temp,
    'humidity': humidity
  };
  PubNub.publish({
    channel: channel,
    message: data,
  });
}
board.on('ready', () => {
  const multi = new five.Multi({
    controller: "DHT22_I2C_NANO_BACKPACK",
    pin: 2,
    freq: 1000
  });

  multi.on('data', (e) => {
    temp = e.thermometer.celsius;
    humidity = e.hygrometer.relativeHumidity;
    console.log("Thermometer");
    console.log("  celsius           : ", e.thermometer.celsius);
    console.log("  fahrenheit        : ", e.thermometer.fahrenheit);
    console.log("  kelvin            : ", e.thermometer.kelvin);
    console.log("--------------------------------------");

    console.log("Hygrometer");
    console.log("  relative humidity : ", e.hygrometer.relativeHumidity);
    console.log("--------------------------------------");
  });

  setInterval(publish, 1000);
});
