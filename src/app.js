require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, specs } = require('./swagger');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World! 백엔드 서버 동작 중');
});

app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
