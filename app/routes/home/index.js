"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.show.home);
router.get("/login", ctrl.show.login);
router.get("/greeting", ctrl.show.greeting);
router.get("/vision", ctrl.show.vision);
router.get("/ips", ctrl.show.ips);
router.get("/academic", ctrl.show.academic);
router.get("/announcement", ctrl.show.announcement);
router.get("/docs", ctrl.show.docs);
router.get("/write", ctrl.show.write);

router.post("/login", ctrl.process.login);

router.post("/createNotice", ctrl.process.createNotice);
router.post("/createDocument", ctrl.process.createDocument);

module.exports = router;
