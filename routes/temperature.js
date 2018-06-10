  module.exports = function(userId, next) {
  
    const pubnub = require('pubnub'),
          express = require("express"),
          router = express.Router(),
          mongoose = require("mongoose"),
          Record = mongoose.model("Record");
    

    const PubNub = new pubnub({
    publish_key: 'pub-c-1a33e74f-10fe-45ad-b6b4-f2dda25251c6',
    subscribe_key: 'sub-c-ebe2b4f8-2506-11e8-bb29-5a43d096f02f'
    });
    const channel = 'temperature-ds18b20';
    const five = require('johnny-five');
    const board = new five.Board();

    let tempCelsius = 0;
    let tempFahrenheit = 0;
    let humidity = 0;
    let tempinf = 0;

    function publish(userId) {
      console.log(userId);
      let data = {
        'temperature': tempCelsius,
        'humidity': humidity
      };
      PubNub.publish({
        channel: channel,
        message: data,
      });

      Record.create({
        user_id: userId,
        temperatureInCelsius: tempCelsius,
        temperatureInFahrenheit: tempFahrenheit,
        relativeHumidity: humidity
      }, function(err, record) {
      if (err) {
          console.log("Error creating record: " + err);
      } else {
          console.log("Record was successfully created: " + record);
      }
      });
    }

    board.on('ready', () => {
      const multi = new five.Multi({
      controller: "DHT22_I2C_NANO_BACKPACK",
      pin: 2,
      freq: 2000
    });

    multi.on('data', (e) => {
      tempCelsius = e.thermometer.celsius;
      tempFahrenheit = e.thermometer.fahrenheit;
      humidity = e.hygrometer.relativeHumidity;
      console.log("Thermometer");
      console.log("  celsius           : ", e.thermometer.celsius);
      console.log("  fahrenheit        : ", e.thermometer.fahrenheit);
      console.log("  kelvin            : ", e.thermometer.kelvin);
      console.log("--------------------------------------");

      console.log("Hygrometer");
      console.log("  relative humidity : ", e.hygrometer.relativeHumidity);
      console.log("--------------------------------------");
      publish(userId);
      });    
    });
    next();
}
