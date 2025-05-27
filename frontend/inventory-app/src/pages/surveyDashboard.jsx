import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../hooks/AuthContext";
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { CreateSurvey } from '../components/createSurvey/createSurvey';
import { DisplaySurvey } from '../components/createSurvey/displaySurvey';
import { DisplaySurveyList } from '../components/createSurvey/displaySurveyList';

function Dashboard() {
    const { user, token } = useAuth();

    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        email: ''
    });
    const [counter, setCounter] = useState(0);
    const [view, setView] = useState('createSurvey');
    const [currentSurveyId, setCurrentSurveyId] = useState('');

    const serverUrl = 'http://localhost:5000';

    const loginOrCreateUser = useCallback(async () => {
        if (!user || !user._id || !token) return; // ✅ null 가드

        try {
            const response = await fetch(`${serverUrl}/users/login`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    _id: user._id
                })
            });

            const data = await response.json();
            setUserData(data);
            console.log("✅ 유저 데이터:", data);
        } catch (error) {
            console.error("❌ 사용자 등록 또는 로그인 실패:", error);
        }
    }, [user, token]);

    useEffect(() => {
        if (counter === 0 && user && token) {
            loginOrCreateUser();
            setCounter(1);
        }
    }, [user, token, loginOrCreateUser, counter]);

    const switchView = (newView) => {
        setView(newView);
    };

    const sendSurveyId = (id) => {
        setCurrentSurveyId(id);
    };

    const renderSwitch = (param) => {
        switch (param) {
            case 'createSurvey':
                return (
                    <CreateSurvey
                        id={userData._id}
                        switchView={switchView}
                        sendSurveyId={sendSurveyId}
                    />
                );
            case 'displaySurvey':
                return (
                    <DisplaySurvey
                        id={userData._id}
                        switchView={switchView}
                        surveyId={currentSurveyId}
                    />
                );
            case 'displaySurveyList':
                return (
                    <DisplaySurveyList
                        id={userData._id}
                        switchView={switchView}
                        sendSurveyId={sendSurveyId}
                    />
                );
            default:
                return <h3>설문 대시보드</h3>;
        }
    };

    return (
        user && token && (
            <>
                <Header name={userData.name} id={userData._id} />
                {renderSwitch(view)}
                <Footer />
            </>
        )
    );
}

export default Dashboard;
