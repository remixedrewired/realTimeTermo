const express = require("express"),
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    app = express(),
    fs = require('fs'),
    moment = require('moment');
    
// Connect to mongodb
mongoose.connect("mongodb://localhost/iotdb", function(err) {
    if (err) throw err;
    console.log("Successfully connected to mongodb");
});

// Loading DB models
const user = require("./models/users"),
    dataset = require("./models/datasets"),
    record = require('./models/records');

//  Loading routes
const routes = require("./routes/index"),
    users = require("./routes/users"),
    datasets = require("./routes/datasets");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Registering middlewares to the app
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// We use mongodb to store session info
// expiration of the session is set to 7 days (ttl option)
app.use(session({
    store: new MongoStore({mongooseConnection: mongoose.connection,
                          ttl: 7*24*60*60}),
    saveUninitialized: true,
    resave: true,
    secret: "MyBigBigSecret"
}));
 // used to manipulate post requests and recongize PUT and DELETE operations
app.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

// Register routes
app.use("/", routes);
app.use("/users", users);
app.use("/datasets", datasets);
app.get('/temperature',
  (req, res, next) => {
    require("./routes/temperature.js")(req.session.user._id, next);
  },
  (req, res) => {
    res.sendFile(path.join(__dirname + '/temperature.html'));
  }
);

app.get('/save', (req, res) => {
  const Record = mongoose.model("Record");
  Record.find({'user_id': req.session.user._id}, (err, records) => {
    if (err) {
      return res.status(500).json({ err });
    }
    else {
      const dateTime = moment().format('YYYYMMDDhhmmss');
      const filePath = path.join(__dirname, dateTime + ".json");
      const jsonRecord = JSON.stringify(records);
      fs.writeFile(filePath, jsonRecord, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          return res.download(path.join(__dirname, dateTime + ".json"));
        }
      });
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});


module.exports = app;
