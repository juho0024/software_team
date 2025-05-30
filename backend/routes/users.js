const express = require('express');
const router = express.Router();

const {
  getUser,
  registerUser,
  loginUser,
  updateUserSurveys,
  deleteUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/authmiddleware');

// 🌐 기본 응답 (테스트용)
router.get('/', (req, res) => {
  res.json({ message: 'You got me' });
});

// 👤 현재 로그인된 사용자 정보 가져오기 (JWT 필요)
router.get('/getUser', protect, getUser);

// 🆕 회원가입: 이메일 인증 이후, 이름을 직접 입력하여 계정 생성
// 요청 body 예시:
// {
//   "email": "student@gachon.ac.kr",
//   "name": "홍길동"
// }
router.post('/register', registerUser);

// 🔑 이메일 로그인 (아직 안 쓰더라도 로그인용 남겨둠)
router.post('/login', loginUser);

// 📋 사용자 설문 결과 업데이트
router.put('/updateSurveys/:id', protect, updateUserSurveys);

// ❌ 계정 삭제
router.delete('/delete/:id', protect, deleteUser);

module.exports = router;
