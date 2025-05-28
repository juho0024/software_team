const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  response: String,
  time: Date,
  _id: String, // 응답 식별자 (프론트에서 uniqid 등으로 생성)
});

const questionSchema = new mongoose.Schema({
  _id: String, // ✅ 프론트에서 생성된 문자열 ID 허용
  type: { type: String, required: true },
  question: { type: String, required: true },
  answer_choices: [String],
  responses: [responseSchema],
});

const surveySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ✅ 문자열 기반 ID 사용
  title: { type: String, required: true },
  description: String,
  user_id: { type: String, required: true },
  creationTime: Date,
  questions: [questionSchema],
});

module.exports = mongoose.model("Survey", surveySchema);
