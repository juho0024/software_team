const mongoose = require('mongoose');

const questionTypeSchema = mongoose.Schema(
  {
    question_type: { type: String, required: true },
    response_type: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuestionType', questionTypeSchema);
