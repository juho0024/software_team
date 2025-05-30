const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  response: String,
  time: Date,
  user_id: String,
  _id: String,
  name: String
});

const questionSchema = new mongoose.Schema({
  _id: String,
  type: { type: String, required: true },
  question: { type: String, required: true },
  answer_choices: [String],
  responses: [responseSchema]
});

const surveySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,

  // ✅ 여기 고쳤음
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  creationTime: Date,
  questions: [questionSchema]
});

module.exports = mongoose.model("Survey", surveySchema);
