import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { CreateSurvey } from '../components/createSurvey/createSurvey';
import { DisplaySurvey } from '../components/createSurvey/displaySurvey';
import { DisplaySurveyList } from '../components/createSurvey/displaySurveyList';

function Dashboard() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        email: ''
    });
    const [counter, setCounter] = useState(0);
    const [view, setView] = useState('createSurvey');
    const [currentSurveyId, setCurrentSurveyId] = useState('');

    const serverUrl = 'http://localhost:5000';

    // 로그인 후 사용자 정보를 서버에 등록하거나 불러오는 함수
    const loginOrCreateUser = useCallback(async (user) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${serverUrl}/users/login`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    _id: user.sub
                })
            });

            const responseData = await response.json();
            setUserData(responseData);
            console.log("✅ 유저 데이터:", responseData);
        } catch (error) {
            console.error("❌ 사용자 등록 또는 로그인 실패:", error);
        }
    }, [getAccessTokenSilently]);

    // 로그인 후 첫 렌더링 시 사용자 등록 시도
    useEffect(() => {
        if (counter === 0 && isAuthenticated) {
            loginOrCreateUser(user);
            setCounter(1);
        }
    }, [user, isAuthenticated, loginOrCreateUser, counter]);

    // 각 화면 뷰 전환 처리
    const switchView = (newView) => {
        setView(newView);
    };

    // 설문 ID 전달 함수
    const sendSurveyId = (id) => {
        setCurrentSurveyId(id);
    };

    // 현재 상태(view)에 따라 렌더링되는 컴포넌트 결정
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
                    />
                );
            default:
                return <h3>설문 대시보드</h3>;
        }
    };

    return (
        isAuthenticated && (
            <>
                <Header name={userData.name} id={userData._id} />
                {renderSwitch(view)}
                <Footer />
            </>
        )
    );
}

export default Dashboard;
