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

// ✅ 특정 설문 조회
router.get('/:id', getSurvey);

// ✅ 특정 유저의 설문 목록 조회
router.get('/surveys-by-user/:id', getSurveysByUser);

// ✅ 설문 생성 또는 업데이트
router.post('/create-update', createandUpdateSurvey);

// ✅ 설문 전체 업데이트
router.put('/update/:id', updateSurvey);

// ✅ 설문 응답 저장
router.put('/update-responses/:id', saveResponsesToSurvey);

// ✅ 설문 삭제
router.delete('/delete/:id', deleteSurvey);

module.exports = router;
