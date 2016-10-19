// var Twitter = require('twitter');
var five = require('johnny-five');

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
//
// let twitter = new Twitter.RestClient(
//   'i7J1phljITfJqCr2fVE8MAkgo',
//   'XuFc81WRsWkPy3zuY6W72LzU21k7FKiW18pmeUGUwixTKg9QGu',
//   '780289600736546816-bnKC1s2bK8siz4H5kcyAny8uQBSPDNn',
//   'qTSBYjkuBjRhpFSlq1rZ2PzUpwEzemR57iV3ckX1HAyES')
//


five.Board().on('ready', function() {
  var temperature = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2
  });

  temperature.on('data', function() {
    console.log(this.celsius + '°C', this.fahrenheit + '°F');
    temp = this.celsius;
    tempinf = this.fahrenheit;
    // if (temp > 30) {
    //   let options = {
    //     screen_name: '@ddhillon10',
    //     text: 'I need water !'
    //   }
    // }
    // twitter.directMessagesNew(options, function (err, data) {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     console.log(data)
    //   }
    // });


  });

  setInterval(publish, 500);
});
