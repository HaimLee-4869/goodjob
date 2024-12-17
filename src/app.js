require('dotenv').config(); // 환경변수 사용
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 테스트용 라우트
app.get('/', (req, res) => {
  res.send('Hello World! 백엔드 서버 동작 중');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
