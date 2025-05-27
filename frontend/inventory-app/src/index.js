import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext'; // ✅ 우리가 만든 context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>  {/* ✅ 여기에서 감싸야 useAuth() 사용 가능 */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
