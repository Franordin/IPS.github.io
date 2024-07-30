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
        title: {
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
        title: {
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
            // res.locals.userId = req.session.userId;

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
    logout: async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Logout failed.");
            }
            res.redirect('/'); // 로그아웃 후 메인 페이지로 리디렉션
        });
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
    viewPost: (req, res) => {
        res.render("home/post");
    },
};

const process = {
    login: (req, res) => {
        const user = new User(req.body);
        const response = user.login();

        if (response.success) {
            req.session.userId = req.body.id; // 세션에 사용자 ID 저장
            return res.json({ success: true }); // 클라이언트에게 성공 응답 전송
        } else {
            return res.json(response); // 클라이언트에게 실패 응답 전송
        }
    },
    createAdminPost: async (req, res) => {
        const { title, writer, board } = req.body;
        try {
            if (board === "board1") {
                // 공지 사항 게시판에 게시물 생성
                await Notices.create({ title: title, writer: writer});
                res.redirect('/announcement');
            } else if (board === "board2") {
                // 학술 정보 게시판에 게시물 생성
                await Notices.create({ title: title, writer: writer});
                res.redirect('/announcement'); // 실제 학술 정보 게시판 페이지로 리다이렉트
            } else if (board === "board3") {
                // 자료실 게시판에 게시물 생성
                await Documents.create({ title: title, writer: writer});
                res.redirect('/docs');
            } else {
                res.status(400).send("Invalid board selection");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to create post");
        }
    },
};

module.exports = {
    show,
    process,
};