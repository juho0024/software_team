const express = require('express');
const router = express.Router();

const {
  getSurvey,
  getSurveysByUser,
  createandUpdateSurvey,
  updateSurvey,
  deleteSurvey,
  saveResponsesToSurvey,
  getAllSurveys                // ✅ 추가
} = require('../controllers/surveyController.js');

router.get('/', getAllSurveys); // ✅ 추가된 라우트 (전체 설문 목록 조회)

router.post('/:id/submit', saveResponsesToSurvey);
router.get('/:id', getSurvey);
router.get('/surveys-by-user/:id', getSurveysByUser);
router.post('/create-update', createandUpdateSurvey);
router.put('/update/:id', updateSurvey);
// router.put('/update-responses/:id', saveResponsesToSurvey);
router.delete('/delete/:id', deleteSurvey);

module.exports = router;
