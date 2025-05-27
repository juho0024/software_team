const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
  {
    question: { type: String, required: true },
    type: { type: String, required: true },
    answer_choices: { type: [String], default: [] },
    survey_id: { type: mongoose.Schema.Types.String, ref: 'Survey' },
    user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
    responses: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
