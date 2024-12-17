// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

// 간단한 라우트
app.get('/', (req, res) => {
  res.send('Hello World! 백엔드 서버 동작 중');
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
