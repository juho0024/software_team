const express = require('express');
const router = express.Router();

const {
  getSurvey,
  getSurveysByUser,
  createandUpdateSurvey,
  updateSurvey,
  deleteSurvey,
  saveResponsesToSurvey
} = require('../controllers/surveyController.js');

// ✅ 설문 응답 저장 라우트 (프론트와 맞추기)
router.post('/:id/submit', saveResponsesToSurvey);

// ✅ 특정 설문 조회
router.get('/:id', getSurvey);

// ✅ 특정 유저의 설문 목록 조회
router.get('/surveys-by-user/:id', getSurveysByUser);

// ✅ 설문 생성 또는 업데이트
router.post('/create-update', createandUpdateSurvey);

// ✅ 설문 전체 업데이트
router.put('/update/:id', updateSurvey);

// ✅ 응답 수정용으로 남겨둘 수도 있음 (선택)
// router.put('/update-responses/:id', saveResponsesToSurvey);

// ✅ 설문 삭제
router.delete('/delete/:id', deleteSurvey);

module.exports = router;
