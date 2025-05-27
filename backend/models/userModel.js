const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ 중복 방지
    },
    password: {
      type: String,
      required: false, // ✅ 로그인 아닌 OAuth 계정도 대비
      default: null,
    },
    surveys: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt 자동 추가
  }
);

module.exports = mongoose.model('User', userSchema);
