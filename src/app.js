// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World! 백엔드 서버 동작 중');
});

// 라우터 등록
app.use('/auth', authRoutes);

// 에러 핸들러 미들웨어 (마지막에)
app.use(errorHandler);

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
