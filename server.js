const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./backend/config/db');

// ✅ DB 연결
connectDB();

const app = express();
const port = process.env.PORT || 8080;

// ✅ 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));

// ✅ 라우터
const surveysRouter = require('./backend/routes/surveys');
const usersRouter = require('./backend/routes/users');   // ✅ ← 여기 중요!
const authRouter = require('./backend/routes/auth');

// ✅ API 라우트
app.use('/api/surveys', surveysRouter);
app.use('/api/user', usersRouter);         // ✅ 사용자 API (getUser 포함)
app.use('/api/auth', authRouter);          // ✅ 이메일 인증

// ✅ 프로덕션 배포용 정적 파일 제공 (React)
if (process.env.NODE_ENV === 'production') {
  console.log('📦 배포 모드: React build 사용 중');
  app.use(express.static(path.join(__dirname, 'frontend/inventory-app/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/inventory-app/build/index.html'));
  });
}

// ✅ 기본 응답
app.get('/', (req, res) => {
  res.json({ message: '서버가 정상 작동 중입니다.' });
});

// ✅ 에러 핸들러
app.use(function (err, req, res, next) {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ✅ 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});

module.exports = { app };
