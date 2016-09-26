# RealTimeTempSensorData-
Using an Arduino MicroController connected to a single wire temperature sensor(DS1820B), getting real time data to the browser in a graphical format.

The programming is done using Node.js for the server. 

Used Configurable Firmata which is used for communciating between Arduino and the computer/tablet/phone  
Also used Johnny Five which is Node.js API to fetch real time data from the Arduino.  
To publish the data to the web, used PubNub which is another Node.js module to send the real time data to the browser. 

To display the data in a live graphical format, used eonc3.js which is another JavaScript library to transform the JSON data to a graphical format for real time visulaization with respect to time.  
