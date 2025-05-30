import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/AuthContext';

function LoginForm() {
    const { login } = useAuth();
    const { apiFetch } = useApi();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const res = await apiFetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            login(res.token);
            navigate(from, { replace: true });
        } catch (err) {
            setErrorMsg('이메일 또는 비밀번호가 잘못되었습니다.');
        }
    };

    return (
        <div className="auth-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="form-control"
                    placeholder="학교 이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary mt-2 w-100">
                    로그인
                </button>
            </form>
            {errorMsg && <p className="text-danger mt-3">{errorMsg}</p>}
        </div>
    );
}

export default LoginForm;
