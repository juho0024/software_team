var express = require('express');
var router = express.Router();
const { getQuestion, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } =require('../middleware/authmiddleware.js');


router.get('/', protect, getQuestion)
router.post('/create', protect, createQuestion);
router.put('/update/:id', protect, updateQuestion);
router.delete('/delete/:id', protect, deleteQuestion)

module.exports = router;
