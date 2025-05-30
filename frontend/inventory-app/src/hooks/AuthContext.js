import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));

                // ✅ name, email 포함된 토큰 디코딩
                setUser({
                    _id: decoded._id,
                    name: decoded.name,
                    email: decoded.email,
                });
            } catch (e) {
                console.error("❌ JWT 디코딩 실패:", e);
                setToken('');
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        try {
            const decoded = JSON.parse(atob(newToken.split('.')[1]));

            setToken(newToken);
            setUser({
                _id: decoded._id,
                name: decoded.name,
                email: decoded.email,
            });
            localStorage.setItem('token', newToken);
        } catch (e) {
            console.error("❌ 로그인 중 JWT 파싱 실패:", e);
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
