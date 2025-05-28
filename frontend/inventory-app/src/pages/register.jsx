import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { apiFetch } = useApi();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!email.endsWith('@gachon.ac.kr')) {
      setMsg('학교 이메일만 등록할 수 있습니다.');
      return;
    }

    try {
      await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setMsg('회원가입 성공! 로그인해주세요.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMsg('회원가입 실패: ' + err.message);
    }
  };

  return (
      <div className="auth-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="이름 또는 닉네임"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
          />
          <input
              type="email"
              placeholder="학교 이메일 (@gachon.ac.kr)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit">회원가입</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
  );
}

export default Register;
