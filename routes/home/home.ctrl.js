"use strict";

const User = require("../../models/User");

// Database
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Academics = sequelize.define(
    'Academics',
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
        content: {
            type: DataTypes.STRING,
        }
    },
    {
        // Other model options go here
    },
);

(async () => {
    await Academics.sync();
})();

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
        content: {
            type: DataTypes.STRING,
        }
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
        content: {
            type: DataTypes.STRING,
        }
    },
    {
        // Other model options go here
    },
);

(async () => {
    await Documents.sync();
})();

const lastRequestTime = {}; // 추가

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
    academic: async (req, res) => {
        try {
            const academics = await Academics.findAll({
                order: [['id', 'DESC']]
            });
            res.render("home/academic", { academics }); // notices를 뷰로 전달
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
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
    viewPost: async (req, res) => {
        try {
            const postId = req.query.id;  // URL 쿼리에서 id를 가져옴
            const type = req.query.type;

            const now = Date.now();

            if (type === "academic") {
                const postContent = await Academics.findOne({
                    where: { id: postId }  // 해당 id와 일치하는 게시글을 찾음
                });
                if (!postContent) {
                    return res.status(404).send("Post not found");
                }
                if (!(lastRequestTime[postId] && now - lastRequestTime[postId] < 1000)) { // 1초 안에 두 번 요청할 경우
                    await postContent.increment('views', { by: 1 });
                }
                res.render("home/post", { postContent, type });
            }
            else if (type === "announce") {
                const postContent = await Notices.findOne({
                    where: { id: postId }  // 해당 id와 일치하는 게시글을 찾음
                });
                if (!postContent) {
                    return res.status(404).send("Post not found");
                }
                if (!(lastRequestTime[postId] && now - lastRequestTime[postId] < 1000)) { // 1초 안에 두 번 요청할 경우
                    await postContent.increment('views', { by: 1 });
                }
                res.render("home/post", { postContent, type });
            }
            else if (type === "doc") {
                const postContent = await Documents.findOne({
                    where: { id: postId }  // 해당 id와 일치하는 게시글을 찾음
                });
                if (!postContent) {
                    return res.status(404).send("Post not found");
                }

                if (!(lastRequestTime[postId] && now - lastRequestTime[postId] < 1000)) { // 1초 안에 두 번 요청할 경우
                    await postContent.increment('views', { by: 1 });
                }
                res.render("home/post", { postContent, type });
            }

            lastRequestTime[postId] = now; // 현재 시간을 저장

        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    },
    editPost: async (req, res) => {
        try {
            const postId = req.query.id;
            const type = req.query.type;
            let postContent;
    
            if (type === "academic") {
                postContent = await Academics.findOne({ where: { id: postId } });
            } else if (type === "announce") {
                postContent = await Notices.findOne({ where: { id: postId } });
            } else if (type === "doc") {
                postContent = await Documents.findOne({ where: { id: postId } });
            }
    
            if (!postContent) {
                return res.status(404).json({ message: "Post not found" });
            }
    
            res.render("home/edit", {postContent, type});
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
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
        const { title, writer, board, cont } = req.body;
        
        const formattedCont = cont.replace(/\n/g, '<br>');

        try {
            if (board === "board1") {
                // 공지 사항 게시판에 게시물 생성
                await Academics.create({ title: title, writer: writer, content: formattedCont });
                res.redirect('/academic');
            } else if (board === "board2") {
                // 학술 정보 게시판에 게시물 생성
                await Notices.create({ title: title, writer: writer, content: formattedCont });
                res.redirect('/announcement');
            } else if (board === "board3") {
                // 자료실 게시판에 게시물 생성
                await Documents.create({ title: title, writer: writer, content: formattedCont });
                res.redirect('/docs');
            } else {
                res.status(400).send("Invalid board selection");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to create post");
        }
    },
    editAdminPost: async (req, res) => {
        // req.body에서 id 값을 가져옴
        const { id, title, writer, board, content } = req.body;
    
        // id 값 확인
        console.log("ID from body:", id);
    
        // 유효성 검사
        if (!id) {
            return res.status(400).send("ID 값이 필요합니다.");
        }
    
        const formattedCont = content.replace(/\n/g, '<br>');
    
        try {
            if (board === "board1") {
                await Academics.update(
                    { title, writer, content: formattedCont },
                    { where: { id } } // id를 사용
                );
                return res.redirect('/academic');
            } else if (board === "board2") {
                await Notices.update(
                    { title, writer, content: formattedCont },
                    { where: { id } }
                );
                return res.redirect('/announcement');
            } else if (board === "board3") {
                await Documents.update(
                    { title, writer, content: formattedCont },
                    { where: { id } }
                );
                return res.redirect('/docs');
            } else {
                return res.status(400).send("Invalid board selection");
            }
        } catch (error) {
            console.error("Database update error:", error);
            return res.status(500).send("Failed to edit admin post");
        }
    },
    deleteAdminPost: async (req, res) => {
        const postId = req.body.postId;  // 삭제할 글 ID
        const type = req.body.type;  // 게시판 타입 (예: announce, doc)
      
        try {
          // 삭제 후 type에 따라 해당 페이지로 리다이렉트
          if (type === 'academic') {
            await Academics.destroy({ where: { id: postId } });  // 'where' 조건 추가
            res.redirect('/academic');
          } else if (type === 'announce') {
            await Notices.destroy({ where: { id: postId } });  // 'where' 조건 추가
            res.redirect('/announcement');
          } else {
            await Documents.destroy({ where: { id: postId } });  // 'where' 조건 추가
            res.redirect('/docs');
          } 
        } catch (error) {
          console.error('Error deleting post:', error);
          res.status(500).send('Error deleting post');
        }
    },
};

module.exports = {
    show,
    process,
};