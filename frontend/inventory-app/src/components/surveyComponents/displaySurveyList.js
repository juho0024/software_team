import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import { serverUrl } from "../../variables/constants.js";
import { useAuth } from "../../hooks/AuthContext";

export function DisplaySurveyList({ sendSurveyId }) {
    const [mySurveys, setMySurveys] = useState(null);
    const [allSurveys, setAllSurveys] = useState([]);
    const [mySurveyItems, setMySurveyItems] = useState(null);
    const [allSurveyItems, setAllSurveyItems] = useState(null);

    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchSurveyLists = useCallback(async () => {
        if (!user || !user._id || !token) return;

        try {
            const myRes = await fetch(
                `${serverUrl}/api/surveys/surveys-by-user/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const myData = await myRes.json();
            if (myData !== "No surveys were found") {
                setMySurveys(myData);
            }

            const allRes = await fetch(`${serverUrl}/api/surveys`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const allData = await allRes.json();
            setAllSurveys(allData);
        } catch (err) {
            console.error("❌ 설문 목록 가져오기 실패:", err);
        }
    }, [token, user]);

    useEffect(() => {
        fetchSurveyLists();
    }, [fetchSurveyLists]);

    useEffect(() => {
        if (!user || !user._id) return;

        if (mySurveys && Array.isArray(mySurveys)) {
            const items = mySurveys.map((survey, idx) => (
                <tr key={`my-${idx}`}>
                    <td>
                        <Link to={`/create-survey/${survey._id}`} style={{ textDecoration: "none" }}>
                            {survey.title}
                        </Link>
                    </td>
                    <td>
                        <Link to={`/display-survey/${survey._id}`} target="_blank" style={{ textDecoration: "none" }}>
                            설문 링크
                        </Link>
                    </td>
                    <td>
                        <Link to={`/display-results/${survey._id}`} style={{ textDecoration: "none" }}>
                            결과 보기 ({survey.responseTotal})
                        </Link>
                    </td>
                </tr>
            ));
            setMySurveyItems(items);
        }

        if (allSurveys && Array.isArray(allSurveys)) {
            const items = allSurveys
                .filter(survey => survey.user_id !== user._id)
                .map((survey, idx) => (
                    <tr key={`all-${idx}`}>
                        <td>
                            <Link to={`/create-survey/${survey._id}`} style={{ textDecoration: "none" }}>
                                {survey.title}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/display-survey/${survey._id}`} target="_blank" style={{ textDecoration: "none" }}>
                                설문 링크
                            </Link>
                        </td>
                    </tr>
                ));
            setAllSurveyItems(items);
        }
    }, [mySurveys, allSurveys, user]);

    const handleCreateSurvey = () => {
        sendSurveyId(null);
        navigate("/create-survey");
    };

    return (
        <main className="main" style={{ backgroundColor: "rgb(237, 244, 245)" }}>
            <Container className="dashboardbg p-0" fluid>
                <Row style={{ paddingTop: 20 }}>
                    <Col>
                        <h2 className="text-center fw-bold pt-3">설문 대시보드</h2>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center p-3">
                        <Button
                            onClick={handleCreateSurvey}
                            variant="primary"
                            className="createSrvyBtn"
                            style={{ borderRadius: 5, borderWidth: 1 }}
                        >
                            새 설문 만들기
                        </Button>
                    </Col>
                </Row>

                {/* ✅ 내 설문 목록 (유지) */}
                {mySurveyItems && (
                    <Row>
                        <Col className="text-center">
                            <h4 className="fw-bold">내 설문 목록</h4>
                            <div style={{ borderTop: "solid", paddingTop: 8 }}>
                                <Table striped bordered hover style={{ width: "50%", margin: "auto" }}>
                                    <thead>
                                    <tr>
                                        <th>설문 제목</th>
                                        <th>설문 링크</th>
                                        <th>결과</th>
                                    </tr>
                                    </thead>
                                    <tbody>{mySurveyItems}</tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* ✅ 진행중인 설문조사 (결과/등록자 컬럼 제거됨) */}
                {allSurveyItems && (
                    <Row>
                        <Col className="text-center">
                            <h4 className="fw-bold mt-5">진행중인 설문조사</h4>
                            <div style={{ borderTop: "solid", paddingTop: 8 }}>
                                <Table striped bordered hover style={{ width: "50%", margin: "auto" }}>
                                    <thead>
                                    <tr>
                                        <th>설문 제목</th>
                                        <th>설문 링크</th>
                                    </tr>
                                    </thead>
                                    <tbody>{allSurveyItems}</tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </main>
    );
}
