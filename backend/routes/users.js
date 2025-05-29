const express = require('express');
const router = express.Router();

const {
  getUser,
  registerUser,
  loginUser, // ✅ 기존 loginOrCreateUser → loginUser로 수정
  updateUserSurveys,
  deleteUser
} = require('../controllers/userController');

const { protect } = require('../middleware/authmiddleware');

// 기본 응답 (테스트용)
router.get('/', (req, res) => {
  res.json({ message: 'You got me' });
});

// ✅ 사용자 정보 가져오기 (보호됨)
router.get('/getUser', protect, getUser);

// ✅ 회원가입
router.post('/register', registerUser);

// ✅ 로그인
router.post('/login', loginUser); // ✅ 여기도 수정됨

// ✅ 사용자 설문 업데이트 (보호됨)
router.put('/updateSurveys/:id', protect, updateUserSurveys);

// ✅ 사용자 삭제 (보호됨)
router.delete('/delete/:id', protect, deleteUser);

module.exports = router;
