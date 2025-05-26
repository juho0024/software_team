var express = require('express');
var router = express.Router();
const { getSurvey, createandUpdateSurvey, updateSurvey, deleteSurvey, saveResponsesToSurvey, getSurveysByUser } = require('../controllers/surveyController.js');

router.get('/:id', getSurvey)
router.get('/surveys-by-user/:id', getSurveysByUser)
router.get('/public', getSurvey);
router.post('/create-update', createandUpdateSurvey);
router.put('/update/:id', updateSurvey);
router.put('/update-responses/:id', saveResponsesToSurvey);

router.delete('/delete/:id', deleteSurvey)

module.exports = router;
