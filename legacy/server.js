const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// SQLite 데이터베이스 연결
let db = new sqlite3.Database('./noticeboard.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the noticeboard database.');
});

// 테이블 생성
db.run(`CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  views INTEGER NOT NULL
)`);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname)));

// 공지사항 목록 가져오기
app.get('/api/announcements', (req, res) => {
  const sql = 'SELECT * FROM announcements ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ announcements: rows });
  });
});

// 공지사항 추가하기
app.post('/api/announcements', (req, res) => {
  const { title, author, date, views } = req.body;
  const sql = 'INSERT INTO announcements (title, author, date, views) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, author, date, views], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
