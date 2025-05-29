const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  response: String,
  time: Date,
  user_id: String,  // ✅ 응답자 ID 포함
  _id: String ,       // 프론트에서 생성된 고유 응답 ID
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
  user_id: { type: String, required: true },
  creationTime: Date,
  questions: [questionSchema]
});

module.exports = mongoose.model("Survey", surveySchema);
