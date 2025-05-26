const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// JWT 검증 미들웨어
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 헤더에 토큰이 있는지 확인
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 토큰 추출
      token = req.headers.authorization.split(' ')[1];

      // 토큰 디코드
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 정보 조회 후 req에 저장
      req.user = await User.findById(decoded.id).select('-password');
      req.id = decoded.id; // 기존 getUser에 req.id 쓰기 위해

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
