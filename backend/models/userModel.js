const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false }, // 🔐 register용 비밀번호 필드 추가
    surveys: { type: [String], default: [] }      // 설문 ID 리스트
});

module.exports = mongoose.model('User', userSchema);