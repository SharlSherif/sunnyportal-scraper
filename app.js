const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

// * establish firebase connection..
require("./public/database")
// * actual api
require("./public/api")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.listen(3000, ()=> console.log("running.. "))