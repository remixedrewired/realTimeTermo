# RealTimeTempSensorData-
Using an Arduino MicroController connected to a single wire temperature sensor(DS1820B), getting real time data to the browser in a graphical format.

The programming is done using Node.js for both the Arduino and for sending the data to the browser. 

Used JohnnyFive, which is a Node.js API to get the analog data from the Arduino to the console in digital format. The data is the real time temperaure using the temperaure sensor. 
To publish the data to the web, used PubNub which is another Node.js module to send the real time data to the browser. 

To display the data in a live graphical format, used eonc3.js which is another JavaScript library to transform the JSON data to a graphical format for real time visulaization with respect to time.  
