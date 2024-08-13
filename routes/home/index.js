"use strict";

const express = require("express");
const path = require("path");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.show.home);
router.get("/login", ctrl.show.login);
router.get("/logout", ctrl.show.logout);
router.get("/greeting", ctrl.show.greeting);
router.get("/vision", ctrl.show.vision);
router.get("/ips", ctrl.show.ips);
router.get("/academic", ctrl.show.academic);
router.get("/announcement", ctrl.show.announcement);
router.get("/docs", ctrl.show.docs);
router.get("/write", ctrl.show.write);
router.get("/viewPost", ctrl.show.viewPost);

router.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__filename, "../../public/robots.txt"));
});
router.get("/sitemap_ips.xml", (req, res) => {
    res.sendFile(path.join(__filename, "../../public/sitemap_ips.xml"));
});
router.get("/sitemap_kndipsl.xml", (req, res) => {
    res.sendFile(path.join(__filename, "../../public//sitemap_kndipsl.xml"));
});

router.post("/login", ctrl.process.login);
router.post("/createAdminPost", ctrl.process.createAdminPost);

module.exports = router;
