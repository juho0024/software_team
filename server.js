var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
const { connectDB } = require('./backend/config/db');
const cors = require('cors')
const { auth } = require('express-openid-connect');


const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000': 'https://www.surveymaker.app';




const port = process.env.PORT || 8080;

var surveysRouter = require('./backend/routes/surveys');
var usersRouter = require('./backend/routes/users');


connectDB();
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({credentials: true, origin: serverUrl}));


app.use('/api/surveys', surveysRouter);
app.use('/users', usersRouter);



if(process.env.NODE_ENV === 'production'){
  console.log('started using build folder');
  app.use(express.static(path.join(__dirname,'frontend/inventory-app/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    console.log('hit');
    res.sendFile(path.join(__dirname, 'frontend/inventory-app/build/index.html'));
  });

}



// error handler
app.use(function(err, req, res, next) {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
});



app.listen(port, () => console.log('CORS-enabled web server started on port ' + port));

module.exports = {app};
