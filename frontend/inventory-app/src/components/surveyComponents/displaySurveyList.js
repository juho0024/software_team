import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Container, Col, Row, Button, Spinner } from "react-bootstrap";
import { serverUrl } from "../../variables/constants.js";
import { useAuth } from "../../hooks/AuthContext";

export function DisplaySurveyList({ sendSurveyId }) {
    const [surveyList, setSurveyList] = useState(null);
    const [tableItems, setTableItems] = useState(
        <tr>
            <td colSpan={3}>
                <div style={{ textAlign: "center", padding: 20 }}>
                    <Spinner animation="border" />
                </div>
            </td>
        </tr>
    );

    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchSurveyList = useCallback(async () => {
        if (!user || !user._id || !token) return; // ✅ null 체크

        try {
            const res = await fetch(
                `${serverUrl}/api/surveys/surveys-by-user/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();

            if (data === "No surveys were found") {
                setTableItems(null);
            } else {
                setSurveyList(data);
            }
        } catch (err) {
            console.error("❌ 설문 목록 가져오기 실패:", err);
        }
    }, [token, user]);

    useEffect(() => {
        fetchSurveyList();
    }, [fetchSurveyList]);

    useEffect(() => {
        if (surveyList && Array.isArray(surveyList)) {
            const items = surveyList.map((survey, idx) => (
                <tr key={idx}>
                    <td>
                        <Link to={`/create-survey/${survey._id}`} style={{ textDecoration: "none" }}>
                            {survey.title}
                        </Link>
                    </td>
                    <td>
                        <Link
                            to={`/display-survey/${survey._id}`}
                            target="_blank"
                            style={{ textDecoration: "none" }}
                        >
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
            setTableItems(items);
        }
    }, [surveyList]);

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

                {tableItems && (
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
                                    <tbody>{tableItems}</tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </main>
    );
}
