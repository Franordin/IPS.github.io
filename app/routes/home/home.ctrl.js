"use strict";

const User = require("../../models/User");

// Database
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Notices = sequelize.define(
    'Notices',
    {
        // Model attributes are defined here
        noticeTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        // Other model options go here
    },
);

(async () => {
    await Notices.sync();
})();

const Documents = sequelize.define(
    'Documents',
    {
        // Model attributes are defined here
        documentTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        // Other model options go here
    },
);

(async () => {
    await Documents.sync();
})();

const show = {
    home: async (req, res) => {
        try {
            // Fetch all records with IDs from 1 to 5
            const notices = await Notices.findAll({
                where: {
                    id: {
                        [Sequelize.Op.between]: [1, 5]
                    }
                }
            });
            const documents = await Documents.findAll({
                where: {
                    id: {
                        [Sequelize.Op.between]: [1, 5]
                    }
                }
            });

            res.render('home/index', { notices, documents });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    login: (req, res) => {
        res.render("home/login");
    },
    greeting: (req, res) => {
        res.render("home/greeting");
    },
    vision: (req, res) => {
        res.render("home/vision");
    },
    ips: (req, res) => {
        res.render("home/ips");
    },
    academic: (req, res) => {
        res.render("home/academic");
    },
    announcement: async (req, res) => {
        try {
            const notices = await Notices.findAll({
                order: [['id', 'DESC']]
            });
            res.render("home/announcement", { notices }); // notices를 뷰로 전달
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    },
    docs: async (req, res) => {
        try {
            const documents = await Documents.findAll({
                order: [['id', 'DESC']]
            });
            res.render("home/docs", { documents });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    },
    write: (req, res) => {
        res.render("home/write");
    },
};

const process = {
    login: (req, res) => {
        const user = new User(req.body);
        const response = user.login();
        console.log(response);
        
        return res.json(response);
    },
    createNotice: async (req, res) => {
        const { noticeTitle, writer } = req.body;
        try {
            await Notices.create({ noticeTitle: noticeTitle, writer: writer });
            res.redirect('/announcement');
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to create notice");
        }
    },
    createDocument: async (req, res) => {
        const { documentTitle, writer } = req.body;
        try {
            await Documents.create({ documentTitle: documentTitle, writer: writer });
            res.redirect('/docs');
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to create document");
        }
    },
};

module.exports = {
    show,
    process,
};