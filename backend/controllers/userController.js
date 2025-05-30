const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ 비밀번호 해시를 위한 bcrypt 추가

// ✅ JWT 토큰 생성 함수
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ 사용자 정보 가져오기
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
});

// ✅ 회원가입 (이름 + 비밀번호까지 등록)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('이름, 이메일, 비밀번호를 모두 입력해주세요.');
  }

  let user = await User.findOne({ email });

  if (user) {
    // ✅ 기존 유저면 이름, 비밀번호만 업데이트
    user.name = name;
    user.password = await bcrypt.hash(password, 10); // 🔐 비번 해싱
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      surveys: [],
    });
  }

  const token = generateToken({
    _id: user._id,
    name: user.name,
    email: user.email,
  });

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// ✅ 로그인 (비밀번호 검증)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('이메일과 비밀번호를 입력해주세요.');
  }

  const user = await User.findOne({ email });

  if (
    user &&
    user.password &&
    await bcrypt.compare(password, user.password)
  ) {
    const token = generateToken({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error('로그인 정보가 일치하지 않습니다.');
  }
});

// ✅ 사용자 설문 업데이트
const updateUserSurveys = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.surveys.includes(req.body.survey_id)) {
    return res.status(200).json({ message: '이미 추가된 설문입니다.' });
  }

  user.surveys.push(req.body.survey_id);
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// ✅ 사용자 삭제
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  await User.deleteOne({ _id: req.params.id });
  const existState = await User.findById(req.params.id);
  res.status(200).json({ id: req.params.id, exists: !!existState });
});

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUserSurveys,
  deleteUser,
};
