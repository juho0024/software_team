import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function SurveySubmit() {
    const navigate = useNavigate();
    const { id } = useParams();

    // 유효하지 않은 접근 방지
    if (!id || id === 'undefined') {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <h4>⚠️ 유효하지 않은 설문 ID입니다.</h4>
                <Button variant="primary" onClick={() => navigate("/")}>
                    홈으로 이동
                </Button>
            </div>
        );
    }

    return (
        <Card style={{ margin: 'auto', width: '40%', marginTop: 20 }}>
            <Card.Header>설문 제출이 완료되었습니다.</Card.Header>
            <Card.Body>
                <Card.Text>
                    다른 응답을 제출하고 싶다면, 아래 버튼을 클릭하세요.
                </Card.Text>
                <Button
                    variant="outline-info"
                    onClick={() => navigate(`/display-survey/${id}`)}
                >
                    다른 응답 제출하기
                </Button>
            </Card.Body>
        </Card>
    );
}

export default SurveySubmit;
