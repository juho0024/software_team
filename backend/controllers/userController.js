// 사용자 관련 CRUD 컨트롤러
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ 모든 사용자 조회
// @route   GET /api/users
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.id });
    res.status(200).json(user);
});

// ✅ 사용자 등록 (회원가입)
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name: username,
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
        throw new Error('Invalid user data');
    }
});

// ✅ 로그인 또는 사용자 자동 생성 (기존 방식 유지)
// @route   POST /api/users/login
const loginOrCreateUser = asyncHandler(async (req, res) => {
    const { name, email, _id } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
        res.status(200).json(user);
    } else {
        const newUser = await User.create({ name, email, _id });
        if (newUser) {
            res.status(201).json({ _id, name, email });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
});

// ✅ 사용자 설문 업데이트
// @route   PUT /api/users/updateSurveys/:id
const updateUserSurveys = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('That user was not found.');
    }

    if (user.surveys.includes(req.body.survey_id)) {
        res.status(200).json({ message: "Survey already added" });
        return;
    }

    user.surveys.push(req.body.survey_id);
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
});

// ✅ 사용자 삭제
// @route   DELETE /api/users/delete/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('That user was not found.');
    }

    await User.deleteOne({ _id: req.params.id });
    const existState = await User.findOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id, exists: existState });
});

// ✅ JWT 토큰 생성 유틸
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
    getUser,
    registerUser,
    loginOrCreateUser,
    updateUserSurveys,
    deleteUser
};
