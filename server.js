const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./backend/config/db');

// 라우터
const surveysRouter = require('./backend/routes/surveys');
const usersRouter = require('./backend/routes/users');

const app = express();
const port = process.env.PORT || 8080;

// ✅ DB 연결
connectDB();

// ✅ 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ CORS 설정 (origin이 없거나 허용된 origin이면 통과)
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.surveymaker.app'
];

// ✅ 임시로 모든 origin 허용 (로컬 테스트 완벽 허용)
app.use(cors({
  origin: true,
  credentials: true,
}));


// ✅ API 라우트
app.use('/api/surveys', surveysRouter);
app.use('/users', usersRouter);

// ✅ 프로덕션 배포용 정적 파일 제공
if (process.env.NODE_ENV === 'production') {
  console.log('📦 배포 모드: React build 사용 중');
  app.use(express.static(path.join(__dirname, 'frontend/inventory-app/build')));

  // React SPA 라우팅 대응
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/inventory-app/build/index.html'));
  });
}

// ✅ 에러 핸들러
app.use(function (err, req, res, next) {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ✅ 서버 시작
app.listen(port, () => console.log(`🚀 서버 실행 중: http://localhost:${port}`));

module.exports = { app };
