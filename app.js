"use strict";

// modules
const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
const app = express();
var favicon = require('serve-favicon');
var session = require('express-session');

// routing
const home = require("./routes/home");

// set default app
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session
app.use(session({secret: 'kgundipsl1q2w3e4r', cookie: {maxAge: 600000}, resave:true, saveUninitialized: true}));
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});

// favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use("/", home);

module.exports = app;
