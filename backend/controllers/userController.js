const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ JWT 토큰 생성
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// ✅ 사용자 정보 가져오기 (보호 라우트용)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
});

// ✅ 회원가입
// @route   POST /users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('모든 필드를 입력해주세요.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('이미 가입된 이메일입니다.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    surveys: []
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('회원가입에 실패했습니다.');
  }
});

// ✅ 로그인
// @route   POST /users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('이메일과 비밀번호를 입력해주세요.');
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
  }
});

// ✅ 사용자 설문 업데이트
// @route   PUT /users/updateSurveys/:id
const updateUserSurveys = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.surveys.includes(req.body.survey_id)) {
    res.status(200).json({ message: '이미 추가된 설문입니다.' });
    return;
  }

  user.surveys.push(req.body.survey_id);
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// ✅ 사용자 삭제
// @route   DELETE /users/delete/:id
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
  deleteUser
};
