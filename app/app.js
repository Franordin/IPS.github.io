"use strict";

// modules
const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');
const app = express();

// routing
const home = require("./routes/home");

// set default app
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use("/", home);

app.post('/createNotice', async function (req, res) {
    const { noticeTitle, writer } = req.body

    await Notices.create({ noticeTitle: noticeTitle, writer: writer });

    res.redirect('/announcement')
});

app.post('/createDocument', async function (req, res) {
    const { documentTitle, writer } = req.body

    await Notices.create({ documentTitle: documentTitle, writer: writer });

    res.redirect('/docs')
});

module.exports = app;
