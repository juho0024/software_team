const express = require("express");
const router = express.Router();
const EmailCode = require("../models/emailCodeModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

// ✅ 이메일 전송용 transporter 설정
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1️⃣ 인증코드 전송
router.post("/send-code", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith("@gachon.ac.kr")) {
    return res.status(400).json({ message: "학교 이메일만 허용됩니다." });
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분 유효

    await EmailCode.deleteMany({ email });
    await EmailCode.create({ email, code, expiresAt });

    await transporter.sendMail({
      from: `"GachonPick" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "[GachonPick] 이메일 인증코드",
      text: `인증코드는 ${code}입니다. 5분 내로 입력해주세요.`,
    });

    console.log("==================================");
    console.log(`📧 인증코드 전송 완료 → ${email}`);
    console.log(`✅ 코드: ${code}`);
    console.log("⌛ 유효기간: 5분");
    console.log("==================================");

    res.json({ message: "이메일로 인증코드가 전송되었습니다." });
  } catch (err) {
    console.error("❌ 인증코드 전송 실패:", err);
    res.status(500).json({ message: "서버 오류로 인증코드 전송 실패" });
  }
});

// 2️⃣ 인증코드 검증 (자동가입 제거 → 회원가입 유도)
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "이메일과 코드가 필요합니다." });
  }

  try {
    const record = await EmailCode.findOne({ email, code });
    if (!record) {
      console.warn(`❌ 인증 실패: 코드 불일치 (${email})`);
      return res.status(400).json({ message: "인증코드가 일치하지 않습니다." });
    }

    if (record.expiresAt < new Date()) {
      console.warn(`⏰ 인증 실패: 코드 만료 (${email})`);
      return res.status(400).json({ message: "인증코드가 만료되었습니다." });
    }

    await EmailCode.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });

    // ✅ 자동가입 제거 → 이름 입력 받기
    if (!user) {
      return res.json({
        success: false,
        verified: true,
        message: "이메일 인증은 완료되었습니다. 회원가입이 필요합니다.",
        email,
      });
    }

    // ✅ 기존 유저 → JWT 발급
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ 인증 처리 중 서버 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
