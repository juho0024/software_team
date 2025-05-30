import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/AuthContext';

function Register() {
  const { apiFetch } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: 이메일, 2: 인증코드, 3: 이름+비번
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // 1️⃣ 인증코드 전송
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!email.endsWith('@gachon.ac.kr')) {
      setMsg('📛 가천대학교 이메일만 등록할 수 있습니다.');
      return;
    }

    try {
      const res = await apiFetch('/api/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (res.message) setMsg(res.message);
      setStep(2);
    } catch (err) {
      setMsg('❌ 인증코드 요청 실패: ' + err.message);
    }
  };

  // 2️⃣ 인증코드 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await apiFetch('/api/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });

      if (res.success && res.token) {
        login(res.token);
        setMsg('✅ 로그인 성공! 대시보드로 이동합니다.');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else if (res.verified) {
        setMsg(res.message || '✅ 인증 성공! 이름과 비밀번호를 입력해주세요.');
        setStep(3);
      } else {
        setMsg(res.message || '❌ 인증 실패');
      }
    } catch (err) {
      setMsg('❌ 인증 실패: ' + err.message);
    }
  };

  // 3️⃣ 이름/비밀번호 입력 → 최종 회원가입
  const handleRegisterName = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await apiFetch('/api/user/register', {
        method: 'POST',
        body: JSON.stringify({ email, name, password }),
      });

      if (res.token) {
        login(res.token);
        setMsg('🎉 회원가입 완료! 대시보드로 이동합니다.');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMsg(res.message || '❌ 회원가입 실패');
      }
    } catch (err) {
      setMsg('❌ 회원가입 실패: ' + err.message);
    }
  };

  return (
      <div className="auth-container">
        <h2>학교 이메일 인증</h2>

        {step === 1 && (
            <form onSubmit={handleSendCode}>
              <input
                  type="email"
                  placeholder="학교 이메일 (@gachon.ac.kr)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <button type="submit">인증코드 보내기</button>
            </form>
        )}

        {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <input
                  type="text"
                  placeholder="받은 인증코드 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
              />
              <button type="submit">인증 확인</button>
            </form>
        )}

        {step === 3 && (
            <form onSubmit={handleRegisterName}>
              <input
                  type="text"
                  placeholder="카카오 ID 입력"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
              <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <button type="submit">회원가입 완료</button>
            </form>
        )}

        {msg && <p style={{ marginTop: '1rem', color: '#333' }}>{msg}</p>}
      </div>
  );
}

export default Register;
